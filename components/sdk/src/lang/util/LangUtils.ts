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
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as fs from "fs";
import ImageMeta from "../ImageMeta";
import Cell from "../cell";
import Composite from "../composite";

/**
 * TypeScript project related utilities.
 */
class LangUtils {

    /**
     * Save the build time snapshot in the output directory.
     *
     * @param imageMetadata Image metadata
     * @param instance The instance of which the snapshot should be saved
     */
    public static saveBuildSnapshot(imageMetadata: ImageMeta, instance: Cell | Composite) {
        const outputDir = process.env[Constants.ENV_VAR_OUTPUT_DIR];
        const typeScriptDir = path.resolve(outputDir, Constants.Project.Build.OUTPUT_DIR_TYPESCRIPT);
        mkdirp.sync(typeScriptDir);
        const cellFile = path.resolve(typeScriptDir, `${imageMetadata.name}-snapshot.json`);

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
        fs.writeFileSync(cellFile, JSON.stringify(snapshot));
    }
}

export default LangUtils;
