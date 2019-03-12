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

import Compiler from "./Compiler";
import Invoker from "./Invoker";
import chalk from "chalk";
import * as log from "log";
import * as logNode from "log-node";
import * as program from "commander";
import * as path from "path";
import * as os from "os";
import {execSync} from "child_process";
import * as fs from "fs";
import * as beautify from "json-beautify";

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
program
    .command("build <projectDir> <orgName> <imageName> <imageVersion>")
    .action(
        async (projectDir, orgName, imageName, imageVersion) => {
            // Invoking the life cycle method
            try {
                await Compiler.compile(projectDir, imageName);
                await Invoker.build(projectDir, orgName, imageName, imageVersion);
            } catch (e) {
                log.error(chalk.red(e));
            }
        }
    );

// Install Cell Reference Command
program
    .command("install-ref <orgName> <imageName> <imageVersion>")
    .action(
        (orgName, imageName, imageVersion) => {
            const ref = path.resolve(os.homedir(), ".cellery", "lang", "typescript", "repo",
                orgName, imageName, imageVersion, `${orgName}-${imageName}-${imageVersion}.tgz`);
            execSync(`npm install ${ref}`);

            const packageJsonFile = path.resolve("./package.json");
            const packageJsonContent = JSON.parse(fs.readFileSync(packageJsonFile).toString());
            packageJsonContent["dependencies"][`@${orgName}/${imageName}`] = `file:${ref}`;
            fs.writeFileSync(packageJsonFile, beautify(packageJsonContent, null, 2, 100));
        }
    );

program.parse(process.argv);
