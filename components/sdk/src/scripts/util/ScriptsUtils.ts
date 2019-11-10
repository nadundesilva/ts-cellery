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

import * as fse from "fs-extra";
import * as log from "log";
import * as path from "path";
import Constants from "../../util/Constants";
import CelleryConfig from "./CelleryConfig";
import Utils from "../../util/Utils";
import PackageJsonConfig from "./PackageJsonConfig";

/**
 * Cellery Project related Utilities.
 */
class ScriptsUtils {
    /**
     * Read the Cellery config in the package.json file.
     *
     * @param imageFQN The fully qualified name of the image
     */
    public static readCelleryConfig(imageFQN: string): CelleryConfig {
        const image = Utils.parseCellImageName(imageFQN);

        // Resolving the package JSON file
        const packageJsonFile = path.resolve(path.join(".", Constants.Project.PACKAGE_JSON_FILE_NAME));
        if (!fse.existsSync(packageJsonFile)) {
            throw Error(`Unable to locate ${packageJsonFile} file`);
        }

        // Reading the package cellery content
        let packageJsonContent;
        try {
            log.debug(`Reading Cellery Cell Project Config from file: ${packageJsonFile}`);
            packageJsonContent = JSON.parse(fse.readFileSync(packageJsonFile, "utf8"));
        } catch {
            throw Error(`Unable to read malformed ${packageJsonFile} file`);
        }
        if (!packageJsonContent.hasOwnProperty(Constants.Project.CELLERY_CONFIG_SECTION_KEY)) {
            throw Error(`Cellery expects the ${Constants.Project.CELLERY_CONFIG_SECTION_KEY} section to be present in `
                + `the ${packageJsonFile} file`);
        }
        const celleryConfig = packageJsonContent[Constants.Project.CELLERY_CONFIG_SECTION_KEY] as PackageJsonConfig;
        log.debug(`Using Cellery Cell Project Config: ${JSON.stringify(celleryConfig)}`);

        // Building Cellery config object
        const config = new CelleryConfig(image, celleryConfig);
        log.debug(`Using Cellery config ${JSON.stringify(config)}`);
        return config;
    }
}

export default ScriptsUtils;
