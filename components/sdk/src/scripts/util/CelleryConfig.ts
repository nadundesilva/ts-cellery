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

import * as path from "path";
import Constants from "../../util/Constants";
import PackageJsonConfig from "./PackageJsonConfig";
import Image from "../../util/Image";

/**
 * Value Holder for the Cellery configuration.
 */
class CelleryConfig {
    public readonly orgName: string;
    public readonly imageName: string;
    public readonly imageVersion: string;

    public readonly cell: string;
    public readonly outputDir: string;
    public readonly compiledCell: string;

    constructor(image: Image, packageJsonConfig: PackageJsonConfig) {
        this.orgName = image.orgName;
        this.imageName = image.imageName;
        this.imageVersion = image.imageVersion;

        this.cell = path.resolve(".", packageJsonConfig.entry);
        this.outputDir = path.resolve(".", Constants.Project.Build.OUTPUT_DIR);
        this.compiledCell = path.resolve(this.outputDir, Constants.Image.SRC_DIR, `${image.imageName}.cell.js`);
    }
}

export default CelleryConfig;
