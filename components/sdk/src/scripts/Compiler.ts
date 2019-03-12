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

import ProjectUtils from "./util/ProjectUtils";
import chalk from "chalk";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import * as webpack from "webpack";
import * as mkdirp from "mkdirp";
import * as log from "log";
import * as ts from "typescript";
import * as rimraf from "rimraf";
import * as path from "path";
import Constants from "../util/Constants";

/**
 * Cellery Typescript compiler which generates the Cellery artifacts.
 */
class Compiler {
    /**
     * Compiler a Cellery Cell in a project and generate artifacts.
     *
     * @param imageName The name of the Cell Image
     */
    public static compile(imageName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const celleryConfig = ProjectUtils.readCelleryConfig(imageName);
            log.info(chalk.green(`Compiling Cell from ${celleryConfig.cell} file`));

            rimraf.sync(celleryConfig.outputDir);
            mkdirp.sync(celleryConfig.outputDir);

            const compiler = webpack({
                mode: "development",
                entry: {
                    [imageName]: celleryConfig.cell
                },
                context: __dirname,
                output: {
                    filename: path.relative(__dirname, celleryConfig.compiledCell),
                    path: path.resolve(__dirname),
                    libraryTarget: "commonjs"
                },
                watch: false,
                module: {
                    rules: [
                        {
                            test: /\.tsx?$/,
                            loader: 'ts-loader',
                            exclude: /node_modules/,
                            options: {
                                context: path.resolve("."),
                                configFile: path.resolve(__dirname, "..", "..", Constants.RESOURCES_DIR,
                                    Constants.TS_CONFIG_FILE_NAME)
                            }
                        },
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                presets: [
                                    [
                                        "es2015",
                                        {
                                            "modules": false
                                        }
                                    ],
                                    "es2016"
                                ]
                            }
                        }
                    ]
                },
                resolve: {
                    extensions: [ '.tsx', '.ts', '.js' ],
                    plugins: [
                        new TsconfigPathsPlugin({
                            baseUrl: path.resolve("."),
                            configFile: path.resolve(__dirname, "..", "..", Constants.RESOURCES_DIR,
                                Constants.TS_CONFIG_FILE_NAME)
                        })
                    ]
                },
                target: 'node',
                node: {
                    __dirname: false,
                    process: false
                }
            });

            compiler.run((err: Error, stats: webpack.Stats) => {
                if (err) {
                    reject(err);
                } else if (stats.hasErrors()) {
                    reject(stats.compilation.errors.map((error) => error.message).join(", "));
                } else {
                    resolve();
                }
            });

            log.info(chalk.green(`Saved compiled Cell into ${celleryConfig.compiledCell}`));
        });
    }
}

export default Compiler;
