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

import chalk from "chalk";
import * as log from "log";
import ProjectUtils from "./util/ProjectUtils";

/**
 * Cellery Cell Lifecycle Invoker.
 */
class CelleryInvoker {
    /**
     * Invoke the build lifecycle of a Cell.
     *
     * @param project Project containing the Cell
     */
    public static build(project: string): void {
        const celleryConfig = ProjectUtils.readCelleryConfig(project);
        log.info(chalk.green(`Building Cell from ${celleryConfig.cell} file`));
    }
}

export default CelleryInvoker;