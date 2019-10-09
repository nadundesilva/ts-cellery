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

import * as fs from "fs";
import * as path from "path";
import Constants from "../../util/Constants";
import CelleryConfig from "./CelleryConfig";

/**
 * Cellery Project related Utilities.
 */
class ProjectUtils {
    /**
     * Read the Cellery config in the package.json file.
     *
     * @param imageName The name of the image
     */
    public static readCelleryConfig(imageName: string): CelleryConfig {
        // Resolving the package JSON file
        const packageJsonFile = path.resolve(path.join(".", Constants.Project.PACKAGE_JSON_FILE_NAME));
        if (!fs.existsSync(packageJsonFile)) {
            throw Error(`Unable to locate ${packageJsonFile} file`);
        }

        // Reading the package cellery content
        let packageJsonContent;
        try {
            packageJsonContent = JSON.parse(fs.readFileSync(`${packageJsonFile}`, "utf8"));
        } catch {
            throw Error(`Unable to read malformed ${packageJsonFile} file`);
        }
        if (!packageJsonContent.hasOwnProperty(Constants.Project.CELLERY_CONFIG_SECTION_KEY)) {
            throw Error(`Cellery expects the ${Constants.Project.CELLERY_CONFIG_SECTION_KEY} section to be present in `
                + `the ${packageJsonFile} file`);
        }
        const celleryConfig = packageJsonContent[Constants.Project.CELLERY_CONFIG_SECTION_KEY];
        celleryConfig.imageName = imageName;

        // Building Cellery config object
        return new CelleryConfig(celleryConfig);
    }

    /**
     * Parse the cell image name in the format org/name:version and return and object containing
     * the image name information.
     *
     * @param name The name of the image in the format org/name:version
     */
    public static parseCellImageName(name: string): {orgName: string, imageName: string, imageVersion: string} {
        if (name == "") {
            throw Error("Image name cannot be empty");
        } else if (!name.match(Constants.CELL_IMAGE_PATTERN)) {
            throw Error(`Invalid image ${name}`);
        }

        // Parsing the cell image string
        const nameSplit = name.split("/");
        const cellImage = {
            orgName: "",
            imageName: "",
            imageVersion: ""
        };
        if (nameSplit.length == 2) {
            cellImage.orgName = nameSplit[0];
            const imageNameSplit = nameSplit[1].split(":");
            if (imageNameSplit.length != 2) {
                throw Error("Invalid image format");
            }
            cellImage.imageName = imageNameSplit[0];
            cellImage.imageVersion = imageNameSplit[1];
        } else {
            throw Error("Invalid image format");
        }
        return cellImage;
    }
}

export default ProjectUtils;
