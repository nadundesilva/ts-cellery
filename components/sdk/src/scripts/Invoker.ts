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

import Constants from "./util/Constants";
import ProjectUtils from "./util/ProjectUtils";
import chalk from "chalk";
import * as log from "log";

/**
 * Cellery Cell Lifecycle Invoker.
 */
class CelleryInvoker {
    /**
     * Invoke the build lifecycle of a Cell.
     *
     * @param project Project containing the Cell
     * @param orgName Organization name of the Cell Image
     * @param imageName Name of the Cell Image
     * @param imageVersion Version of the Cell Image
     */
    public static async build(project: string, orgName: string, imageName: string, imageVersion: string) {
        const celleryConfig = ProjectUtils.readCelleryConfig(project);
        log.info(chalk.green(`Building Cell from ${celleryConfig.compiledCell} file`));

        // Loading the Cell File's exported module
        let cellModule;
        try {
            cellModule = await import(celleryConfig.compiledCell);
        } catch (e) {
            throw Error(`Failed to find compiled Cell file ${celleryConfig.compiledCell}`);
        }

        // Invoking the build life cycle method of the Cell Image
        for (const cellClassName in cellModule) {
            if (cellModule.hasOwnProperty(cellClassName)) {
                process.env[Constants.ENV_VAR_OUTPUT_DIR] = celleryConfig.outputDir;

                const cell = new cellModule[cellClassName]();
                cell.build(orgName, imageName, imageVersion);
            }
        }
    }
}

export default CelleryInvoker;