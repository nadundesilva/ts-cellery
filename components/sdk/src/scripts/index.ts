#!/usr/bin/env node

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

import * as program from "commander";
import * as fs from "fs";
import * as log from "log";
import * as logNode from "log-node";
import * as path from "path";
import Constants from "../util/Constants";
import Compiler from "./Compiler";
import Invoker from "./Invoker";
import ProjectUtils from "./util/ProjectUtils";

program
    .option("-v, --verbose", "increase the verbosity of the output")
    .parseOptions(process.argv);

// Adjusting the verbosity of the program
if (program.verbose) {
    process.env.LOG_LEVEL = "debug";
} else {
    process.env.LOG_LEVEL = "info";
}
// Enable NodeJS logging
logNode();

// Build command
program.command("build <image>").action(async (image) => {
    const {
        orgName,
        imageName,
        imageVersion
    } = ProjectUtils.parseCellImageName(image);

    // Invoking the life cycle method
    try {
        await Compiler.compile(imageName);
        await Invoker.build(orgName, imageName, imageVersion);
    } catch (e) {
        log.error(e);
    }
});

program.parse(process.argv);
