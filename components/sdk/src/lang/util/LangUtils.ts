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
import * as log from "log";
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
     * @param image The image of which the build-time snapshot should be saved
     */
    public static saveBuildSnapshot(imageMetadata: ImageMeta, image: Cell | Composite) {
        log.info("Saving build time snapshot for Image");
        let snapshot;
        if (image instanceof Cell) {
            snapshot = {
                components: image.components,
                globalPublisher: image.globalPublisher
            }
        } else if (image instanceof Composite) {
            snapshot = {
                components: image.components
            }
        } else {
            throw Error("Unknown type " + typeof image + " passed as the instance");
        }

        const outputDir = process.env[Constants.ENV_VAR_OUTPUT_DIR];
        const cellFile = path.resolve(outputDir, Constants.Image.SNAPSHOT_FILE);
        fse.outputFileSync(cellFile, JSON.stringify(snapshot));
    }

    /**
     * Generate metadata file from an instance.
     *
     * @param imageMetadata Image metadata
     * @param image The image of which the metadata file should be generated
     */
    public static async generateMetadata(imageMetadata: ImageMeta, image: Cell | Composite) {
        log.info("Generating metadata for Image");
        let kind;
        const instanceIngressTypes = {};
        if (image instanceof Cell) {
            kind = "Cell";
            image.components.forEach((component) => {
                const ingressTypes = new Set<string>();
                Object.values(component.ingresses).forEach((ingress) => {
                    ingressTypes.add(ingress.type);
                });
                instanceIngressTypes[component.name] = Array.from(ingressTypes);
            });
        } else if (image instanceof Composite) {
            kind = "Composite";
            image.components.forEach((component) => {
                const ingressTypes = new Set<string>();
                Object.values(component.ingresses).forEach((ingress) => {
                    ingressTypes.add(ingress.type);
                });
                instanceIngressTypes[component.name] = Array.from(ingressTypes);
            });
        } else {
            throw Error("Unknown type " + typeof image + " passed as the instance");
        }

        let zeroScalingRequired;
        let autoScalingRequired;
        const components: {[key: string]: ComponentMetaData} = {};
        for (const component of image.components) {
            if (component.scalingPolicy) {
                if (component.scalingPolicy.type === Constants.ScalingPolicy.ZERO_SCALING) {
                    zeroScalingRequired = true;
                } else if (component.scalingPolicy.type === Constants.ScalingPolicy.AUTO_SCALING) {
                    autoScalingRequired = true;
                } else {
                    throw Error("Unknown scaling policy type " + typeof image + " passed as the instance");
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
     * Generate reference file from an instance.
     *
     * @param image The image of which the reference file should be generated
     */
    public static generateReference(image: Cell | Composite) {
        log.info("Generating reference for Image");
        const sanitize = (input: string) => {
            return input.toLowerCase().replace(/[^a-z0-9]/g, "_");
        };
        const reference = {};
        if (image instanceof Cell) {
            for (const component of image.components) {
                const sanitizedComponentName = sanitize(component.name);
                for (const [ingressName, ingress] of Object.entries(component.ingresses)) {
                    const sanitizedIngressName = sanitize(ingressName);
                    if (ingress.type === Constants.Ingress.Type.TCP) {
                        reference[`${sanitizedComponentName}_${sanitizedIngressName}_tcp_port`] = ingress.gatewayPort;
                    } else if (ingress.type === Constants.Ingress.Type.HTTP) {
                        reference[`${sanitizedComponentName}_${sanitizedIngressName}_http_url`] =
                            Constants.Ingress.HTTP_INGRESS_DEFAULT_PROTOCOL + "://"
                            + Constants.Image.INSTANCE_PLACEHOLDER + Constants.INSTANCE_COMPONENT_SEPARATOR
                            + sanitizedComponentName + ":" + Constants.Ingress.HTTP_INGRESS_DEFAULT_PORT + "/"
                            + ingress.context;
                    } else if (ingress.type === Constants.Ingress.Type.GRPC) {
                        reference[`${sanitizedComponentName}_${sanitizedIngressName}_grpc_port`] = ingress.gatewayPort;
                    } else if (ingress.type === Constants.Ingress.Type.WEB) {
                        // Web ingresses are directly exposed by the Cluster Ingress and
                        // therefore not used by other instances
                    } else {
                        throw Error("Unknown scaling policy type " + typeof image + " passed as the instance");
                    }
                }
            }
            reference[`${Constants.GATEWAY}_host`] = Constants.Image.INSTANCE_PLACEHOLDER
                + Constants.INSTANCE_COMPONENT_SEPARATOR + Constants.GATEWAY;
        } else if (image instanceof Composite) {
            for (const component of image.components) {
                const sanitizedComponentName = sanitize(component.name);
                for (const [ingressName, ingress] of Object.entries(component.ingresses)) {
                    const sanitizedIngressName = sanitize(ingressName);
                    if (ingress.type === Constants.Ingress.Type.TCP) {
                        reference[`${sanitizedComponentName}_${sanitizedIngressName}_tcp_port`] = ingress.port;
                    } else if (ingress.type === Constants.Ingress.Type.HTTP) {
                        reference[`${sanitizedComponentName}_${sanitizedIngressName}_http_port`] = ingress.port;
                    } else {
                        throw Error("Unknown scaling policy type " + typeof image + " passed as the instance");
                    }
                }
                reference[`${sanitizedComponentName}_host`] = Constants.Image.INSTANCE_PLACEHOLDER
                    + Constants.INSTANCE_COMPONENT_SEPARATOR + sanitizedComponentName;
            }
        } else {
            throw Error("Unknown type " + typeof image + " passed as the instance");
        }

        const outputDir = process.env[Constants.ENV_VAR_OUTPUT_DIR];
        const referenceFile = path.resolve(outputDir, Constants.Image.REFERENCE_FILE);
        fse.outputFileSync(referenceFile, JSON.stringify(reference));
    }

    /**
     * Create an image and save it in the local repository.
     *
     * @param imageMetadata Image metadata
     */
    public static saveImageToLocalRepository(imageMetadata: ImageMeta): Promise<null> {
        log.info("Generating Image from artifacts");
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
                log.info(`Generated Image: ${outputZipFilePath}`);
                fse.removeSync(path.resolve(Constants.CELLERY_LOCAL_REPO, imageMetadata.org, imageMetadata.name,
                    imageMetadata.ver));
                fse.copySync(outputZipFilePath, path.resolve(Constants.CELLERY_LOCAL_REPO, imageMetadata.org,
                    imageMetadata.name, imageMetadata.ver, zipFileName));
                resolve();
                log.info("Saved image to local repository");
            });
            await archive.finalize();
        }));
    }
}

export default LangUtils;
