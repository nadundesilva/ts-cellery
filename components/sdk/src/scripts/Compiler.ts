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
import * as path from "path";
import * as rimraf from "rimraf";
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import * as webpack from "webpack";
import * as fse from "fs-extra";
import Constants from "../util/Constants";
import CelleryConfig from "./util/CelleryConfig";

/**
 * Cellery Typescript compiler which generates the Cellery artifacts.
 */
class Compiler {
    /**
     * Compiler a Cellery Cell in a project and generate artifacts.
     *
     * @param celleryConfig Cellery configuration
     */
    public static compile(celleryConfig: CelleryConfig): Promise<void> {
        return new Promise((resolve, reject) => {
            log.debug(
                `Removing target directory if it exists: ${celleryConfig.outputDir}`
            );
            rimraf.sync(celleryConfig.outputDir);
            fse.ensureDirSync(celleryConfig.outputDir);

            const compiler = webpack({
                mode: "production",
                entry: {
                    [celleryConfig.imageName]: celleryConfig.cell
                },
                context: __dirname,
                output: {
                    filename: path.relative(
                        __dirname,
                        celleryConfig.compiledCell
                    ),
                    path: path.resolve(__dirname),
                    libraryTarget: "commonjs"
                },
                watch: false,
                module: {
                    rules: [
                        {
                            test: /\.tsx?$/,
                            loader: "ts-loader",
                            exclude: /node_modules/,
                            options: {
                                context: path.resolve("."),
                                configFile: path.resolve(
                                    __dirname,
                                    `../../${Constants.TS_CONFIG}`
                                )
                            }
                        },
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: "babel-loader",
                            options: {
                                cacheDirectory: true,
                                presets: ["@babel/preset-env"]
                            }
                        }
                    ]
                },
                resolve: {
                    extensions: [".tsx", ".ts", ".js", ".json"],
                    plugins: [
                        new TsconfigPathsPlugin({
                            baseUrl: path.resolve("."),
                            configFile: path.resolve(
                                __dirname,
                                `../../${Constants.TS_CONFIG}`
                            )
                        })
                    ]
                },
                target: "node",
                node: {
                    __dirname: false,
                    process: false
                }
            });

            log.info("Compiling Cell file");
            log.debug(`Compiling source Cell file: ${celleryConfig.cell}`);
            compiler.run((err: Error, stats: webpack.Stats) => {
                if (err) {
                    reject(err);
                } else if (stats.hasErrors()) {
                    reject(
                        stats.compilation.errors
                            .map((error) => error.message)
                            .join(", ")
                    );
                } else {
                    log.debug(
                        `Saved compiled Cell into ${celleryConfig.compiledCell}`
                    );
                    resolve();
                }
            });
        });
    }
}

export default Compiler;
