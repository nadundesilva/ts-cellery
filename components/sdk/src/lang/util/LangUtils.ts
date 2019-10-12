/*
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import Constants from "../../util/Constants";
import * as path from "path";
import * as fse from "fs-extra";
import * as archiver from "archiver";
import ImageMeta from "../ImageMeta";
import Cell from "../cell";
import Composite from "../composite";
import Metadata from "../metadata";
import ComponentMetaData from "../metadata/ComponentMetaData";
import Utils from "../../util/Utils";

/**
 * TypeScript project related utilities.
 */
class LangUtils {

    /**
     * Save the build time snapshot in the output directory.
     *
     * @param imageMetadata Image metadata
     * @param instance The instance of which the build-time snapshot should be saved
     */
    public static saveBuildSnapshot(imageMetadata: ImageMeta, instance: Cell | Composite) {
        let snapshot;
        if (instance instanceof Cell) {
            snapshot = {
                components: instance.components,
                globalPublisher: instance.globalPublisher
            }
        } else if (instance instanceof Composite) {
            snapshot = {
                components: instance.components
            }
        } else {
            throw Error("Unknown type " + typeof instance + " passed as the instance");
        }

        const outputDir = process.env[Constants.ENV_VAR_OUTPUT_DIR];
        const cellFile = path.resolve(outputDir, Constants.Image.SNAPSHOT_FILE);
        fse.outputFileSync(cellFile, JSON.stringify(snapshot));
    }

    /**
     * Generate metadata file from an instance.
     *
     * @param imageMetadata Image metadata
     * @param instance The instance of which the metadata file should be generated
     */
    public static async generateMetadata(imageMetadata: ImageMeta, instance: Cell | Composite) {
        let kind;
        const instanceIngressTypes = {};
        if (instance instanceof Cell) {
            kind = "Cell";
            instance.components.forEach((component) => {
                const ingressTypes = new Set<string>();
                Object.values(component.ingresses).forEach((ingress) => {
                    ingressTypes.add(ingress.type);
                });
                instanceIngressTypes[component.name] = Array.from(ingressTypes);
            });
        } else if (instance instanceof Composite) {
            kind = "Composite";
            instance.components.forEach((component) => {
                const ingressTypes = new Set<string>();
                Object.values(component.ingresses).forEach((ingress) => {
                    ingressTypes.add(ingress.type);
                });
                instanceIngressTypes[component.name] = Array.from(ingressTypes);
            });
        } else {
            throw Error("Unknown type " + typeof instance + " passed as the instance");
        }

        let zeroScalingRequired;
        let autoScalingRequired;
        const components: {[key: string]: ComponentMetaData} = {};
        for (const component of instance.components) {
            if (component.scalingPolicy) {
                if (component.scalingPolicy.type === Constants.ScalingPolicy.ZERO_SCALING) {
                    zeroScalingRequired = true;
                } else if (component.scalingPolicy.type === Constants.ScalingPolicy.AUTO_SCALING) {
                    autoScalingRequired = true;
                } else {
                    throw Error("Unknown scaling policy type " + typeof instance + " passed as the instance");
                }
            }

            const componentMetadata: ComponentMetaData = {
                dockerImage: component.source.getImageTag(),
                isDockerPushRequired: component.source.isDockerPushRequired(),
                labels: component.labels,
                ingressTypes: instanceIngressTypes[component.name],
                dependencies: {
                    cells: {},
                    composites: {},
                    components: component.dependencies && component.dependencies.components
                        ? component.dependencies.components.map((dependentComponent) => dependentComponent.name)
                        : []
                }
            };

            const extractImageMeta = (alias, dependentImage): Promise<Metadata> => {
                let orgName;
                let imageName;
                let imageVersion;
                if (typeof dependentImage === "string") {
                    const image = Utils.parseCellImageName(dependentImage);
                    orgName = image.orgName;
                    imageName = image.imageName;
                    imageVersion = image.imageVersion;
                } else {
                    orgName = dependentImage.org;
                    imageName = dependentImage.name;
                    imageVersion = dependentImage.ver;
                }
                return new Promise<Metadata>(async (resolve, reject) => {
                    let extractedImagePath;
                    try {
                        extractedImagePath = await Utils.extractCellImage(orgName, imageName, imageVersion);
                    } catch (err) {
                        reject(err);
                    }
                    const metadataFilePath = path.resolve(extractedImagePath, Constants.Image.METADATA_FILE);
                    const dependentMetadataConent = fse.readFileSync(metadataFilePath, "utf8");
                    resolve(JSON.parse(dependentMetadataConent));
                });
            };
            if (component.dependencies && component.dependencies.cells) {
                for (const [alias, dependentImage] of Object.entries(component.dependencies.cells)) {
                    componentMetadata.dependencies.cells[alias] = await extractImageMeta(alias, dependentImage);
                }
            }
            if (component.dependencies && component.dependencies.composites) {
                for (const [alias, dependentImage] of Object.entries(component.dependencies.composites)) {
                    componentMetadata.dependencies.composites[alias] = await extractImageMeta(alias, dependentImage);
                }
            }

            components[component.name] = componentMetadata;
        }

        const metadata: Metadata = {
            org: imageMetadata.org,
            name: imageMetadata.name,
            ver: imageMetadata.ver,
            schemaVersion: "0.1.0",
            kind: kind,
            components: components,
            buildTimestamp: new Date().getTime(),
            buildCelleryVersion: Constants.VERSION,
            zeroScalingRequired: zeroScalingRequired,
            autoScalingRequired: autoScalingRequired
        };

        const outputDir = process.env[Constants.ENV_VAR_OUTPUT_DIR];
        const metadataFile = path.resolve(outputDir, Constants.Image.METADATA_FILE);
        fse.outputFileSync(metadataFile, JSON.stringify(metadata));
    }

    /**
     * Create an image and save it in the local repository.
     *
     * @param imageMetadata Image metadata
     * @param instance The instance of which the image should be saved
     */
    public static saveImageToLocalRepository(imageMetadata: ImageMeta, instance: Cell | Composite): Promise<null> {
        const outputDir = process.env[Constants.ENV_VAR_OUTPUT_DIR];
        const zipFileName = `${imageMetadata.name}.zip`;
        const outputZipFilePath = path.resolve(outputDir, zipFileName);

        const outputZipFile = fse.createWriteStream(outputZipFilePath);
        const archive = archiver("zip");
        archive.pipe(outputZipFile);
        for (const dirItem of fse.readdirSync(outputDir)) {
            if (dirItem !== zipFileName) {
                const dirItemPath = path.resolve(outputDir, dirItem);
                const stat = fse.lstatSync(dirItemPath);
                if (stat.isDirectory()) {
                    archive.directory(dirItemPath, dirItem);
                } else {
                    archive.file(dirItemPath, {name: dirItem});
                }
            }
        }

        return new Promise((async (resolve) => {
            outputZipFile.on("finish", function() {
                fse.removeSync(path.resolve(Constants.CELLERY_LOCAL_REPO, imageMetadata.org, imageMetadata.name,
                    imageMetadata.ver));
                fse.copySync(outputZipFilePath, path.resolve(Constants.CELLERY_LOCAL_REPO, imageMetadata.org,
                    imageMetadata.name, imageMetadata.ver, zipFileName));
                resolve();
            });
            await archive.finalize();
        }));
    }
}

export default LangUtils;
