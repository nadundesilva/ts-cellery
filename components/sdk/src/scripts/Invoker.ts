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

import * as log from "log";
import Constants from "../util/Constants";
import ScriptsUtils from "./util/ScriptsUtils";
import CelleryConfig from "./util/CelleryConfig";

/**
 * Cellery Cell Lifecycle Invoker.
 */
class CelleryInvoker {
    /**
     * Invoke the build lifecycle of a Cell.
     *
     * @param orgName Organization name of the Cell Image
     * @param imageName Name of the Cell Image
     * @param imageVersion Version of the Cell Image
     * @param celleryConfig Cellery configuration
     */
    public static async build(
        orgName: string,
        imageName: string,
        imageVersion: string,
        celleryConfig: CelleryConfig
    ) {
        // Loading the Cell File's exported module
        let cellModule;
        try {
            log.debug(
                `Dynamically importing compiled Cell file: ${celleryConfig.compiledCell}`
            );
            cellModule = await import(celleryConfig.compiledCell);
        } catch (e) {
            throw Error(
                `Failed to load compiled Cell file ${celleryConfig.compiledCell} due to ${e}`
            );
        }

        // Invoking the build life cycle method of the Cell Image
        for (const cellClassName in cellModule) {
            if (cellModule.hasOwnProperty(cellClassName)) {
                process.env[Constants.ENV_VAR_OUTPUT_DIR] =
                    celleryConfig.outputDir;

                const cell = new cellModule[cellClassName]();
                log.info("Invoking build function");
                log.debug(
                    `Invoking build function from file: ${celleryConfig.compiledCell}`
                );
                await cell.build({
                    org: orgName,
                    name: imageName,
                    ver: imageVersion
                });
            }
        }
    }
}

export default CelleryInvoker;
