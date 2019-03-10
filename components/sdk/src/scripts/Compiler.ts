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

import CelleryConfig from "./util/CelleryConfig";
import Constants from "../util/Constants";
import ProjectUtils from "./util/ProjectUtils";
import chalk from "chalk";
import * as fs from "fs";
import * as log from "log";
import * as path from "path";
import * as ts from "typescript";
import * as rimraf from "rimraf";

/**
 * Cellery Typescript compiler which generates the Cellery artifacts.
 */
class Compiler {
    /**
     * Compiler a Cellery Cell in a project and generate artifacts.
     *
     * @param project The project root dir or project package.json file from which the build information
     *                should be inferred
     */
    public static compile(project: string): void {
        const celleryConfig = ProjectUtils.readCelleryConfig(project);
        log.info(chalk.green(`Compiling Cell from ${celleryConfig.cell} file`));

        rimraf.sync(celleryConfig.outputDir);
        fs.mkdirSync(celleryConfig.outputDir, {recursive: true});

        const tsConfigFile = path.resolve(
            __dirname,
            "../../",
            Constants.RESOURCES_DIR,
            Constants.TS_CONFIG_FILE_NAME
        );
        const typescriptConfig = Compiler.readTypescriptConfig(
            tsConfigFile,
            celleryConfig
        );

        // Compile
        const program = ts.createProgram(
            typescriptConfig.fileNames,
            typescriptConfig.options
        );
        const emitResult = program.emit();

        // Report errors
        Compiler.reportDiagnostics(
            ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics)
        );

        // Fail if compilation failed
        if (emitResult.emitSkipped) {
            throw Error("Failed to Compile Cell");
        }

        fs.copyFileSync(
            path.resolve(project, Constants.Project.PACKAGE_JSON_FILE_NAME),
            path.resolve(celleryConfig.outputDir, Constants.Project.PACKAGE_JSON_FILE_NAME)
        );

        log.info(chalk.green(`Saved compiled Cell into ${celleryConfig.compiledCell}`));
    }

    /**
     * Read the type script config file and properly alter to fit the Cellery Cell Build.
     *
     * @param configFileName The Typescript config file name
     * @param celleryConfig The Cellery Configuration
     */
    public static readTypescriptConfig(
        configFileName: string,
        celleryConfig: CelleryConfig
    ) {
        // Read config file
        const configFileText = fs.readFileSync(configFileName).toString();

        // Parse JSON, after removing comments. Just fancier JSON.parse
        const result = ts.parseConfigFileTextToJson(
            configFileName,
            configFileText
        );

        // Injecting config from Cellery config
        result.config.include.push(celleryConfig.cell);
        result.config.compilerOptions.outDir = celleryConfig.outputDir;

        const configObject = result.config;
        if (!configObject) {
            Compiler.reportDiagnostics([result.error]);
            process.exit(1);
        }

        // Extract config information
        const configParseResult = ts.parseJsonConfigFileContent(
            configObject,
            ts.sys,
            path.dirname(configFileName)
        );
        if (configParseResult.errors.length > 0) {
            Compiler.reportDiagnostics(configParseResult.errors);
            process.exit(1);
        }
        return configParseResult;
    }

    /**
     * Report diagnostic information to the user.
     *
     * @param diagnostics Typescript compiler diagnostics to report
     */
    private static reportDiagnostics(diagnostics: ts.Diagnostic[]): void {
        diagnostics.forEach((diagnostic) => {
            let message = "Error";
            if (diagnostic.file) {
                const {
                    line,
                    character
                } = diagnostic.file.getLineAndCharacterOfPosition(
                    diagnostic.start
                );
                message += ` ${diagnostic.file.fileName} (${line +
                    1},${character + 1})`;
            }
            message += `: ${ts.flattenDiagnosticMessageText(
                diagnostic.messageText,
                "\n"
            )}`;
            log.info(message);
        });
    }
}

export default Compiler;
