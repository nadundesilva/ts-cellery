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
import CelleryConfig from "./CelleryConfig";
import Constants from "./Constants";

/**
 * Cellery Project related Utilities.
 */
class ProjectUtils {
    /**
     * Read the Cellery config in the package.json file.
     *
     * @param projectPath The root directory of the project which contains the cell
     */
    public static readCelleryConfig(projectPath: string): CelleryConfig {
        // Resolving the package JSON file
        let packageJsonFile;
        if (path.basename(projectPath) === Constants.PACKAGE_JSON_FILE_NAME) {
            packageJsonFile = projectPath;
        } else {
            packageJsonFile = path.resolve(path.join(projectPath, Constants.PACKAGE_JSON_FILE_NAME));
        }
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
        if (!packageJsonContent.hasOwnProperty(Constants.CELLERY_CONFIG_SECTION_KEY)) {
            throw Error(`Cellery expects the ${Constants.CELLERY_CONFIG_SECTION_KEY} section to be present in `
                + `the ${packageJsonFile} file`);
        }
        const celleryConfig = packageJsonContent[Constants.CELLERY_CONFIG_SECTION_KEY];

        // Building Cellery config object
        return new CelleryConfig(celleryConfig, projectPath);
    }
}

export default ProjectUtils;
