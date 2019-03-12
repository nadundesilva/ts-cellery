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

import {Component, ComponentIngress} from "../component";
import CellIngress from "./CellIngress";
import Constants from "../../util/Constants";
import * as mkdirp from "mkdirp";
import * as os from "os";
import * as Handlebars from "handlebars";
import * as fs from "fs";
import * as kubernetes from "../../kubernetes";
import * as path from "path";
import * as rimraf from "rimraf";
import {execSync} from "child_process";

/**
 * Cell Image model.
 *
 * This should be extended and implemented when creating Cells.
 */
abstract class CellImage {
    private readonly components: Component[] = [];
    private readonly exposedIngresses: CellIngress[] = [];

    /**
     * Cellery Lifecycle method which will be called during the build.
     *
     * @param orgName The Cell organization name
     * @param imageName The Cell image name
     * @param imageVersion The Cell image version
     */
    public abstract build(orgName: string, imageName: string, imageVersion: string): void;

    /**
     * Add a component to this cell image.
     *
     * @param component The component to be added
     */
    protected addComponent(component: Component): void {
        const matchCount = this.components.filter(
            (existingComponent) => existingComponent.name === component.name).length;
        if (matchCount === 0) {
            this.components.push(component);
        } else {
            throw Error(`Component ${component.name} already exists`);
        }
    }

    /**
     * Expose all the ingresses of a component at Cell Level.
     *
     * @param component Component of which the ingresses should be exposed.
     */
    protected expose(component: Component): void {
        Object.keys(component.ingresses).forEach((ingressName) => {
            this.exposedIngresses.push({
                componentIngressName: ingressName,
                isGlobal: false
            });
        });
    }

    /**
     * Expose all the ingresses of a component globally.
     *
     * @param component Component of which the ingresses should be exposed.
     */
    protected exposeGlobal(component: Component): void {
        Object.keys(component.ingresses).forEach((ingressName) => {
            this.exposedIngresses.push({
                componentIngressName: ingressName,
                isGlobal: true
            });
        });
    }

    /**
     * Build the image artifacts.
     *
     * @param orgName The Cell organization name
     * @param imageName The Cell image name
     * @param imageVersion The Cell image version
     */
    protected buildArtifacts(orgName: string, imageName: string, imageVersion: string): void {
        this.buildCellFile(orgName, imageName, imageVersion);
        this.buildCellReferenceFile(orgName, imageName, imageVersion);
    }

    /**
     * Build the Cell File to be deployed in the runtime.
     *
     * @param orgName Organization name of the Cell Image
     * @param imageName Name of the Cell Image
     * @param imageVersion Version of the Cell Image
     */
    private buildCellFile(orgName: string, imageName: string, imageVersion: string): void {
        const cellFileContent = new kubernetes.CellBuilder(orgName, imageName, imageVersion)
            .withComponents(this.components)
            .withExposedIngresses(this.exposedIngresses)
            .build();

        const outputDir = process.env[Constants.ENV_VAR_OUTPUT_DIR];

        const celleryDir = path.resolve(outputDir, Constants.Project.Build.OUTPUT_DIR_CELLERY);
        mkdirp.sync(celleryDir);

        const cellFile = path.resolve(celleryDir, `${imageName}.yaml`);
        fs.writeFileSync(cellFile, cellFileContent);
    }

    /**
     * Build the Cell Reference File to be used by the Cell consumers.
     *
     * @param orgName Organization name of the Cell Image
     * @param imageName Name of the Cell Image
     * @param imageVersion Version of the Cell Image
     */
    private buildCellReferenceFile(orgName: string, imageName: string, imageVersion: string): void {
        // Finding the exposed ingresses
        const ingresses: {isGlobal: boolean, protocol: string, ingress: ComponentIngress}[] = [];
        this.exposedIngresses.forEach((exposedIngress) => {
            const matches = this.components.filter(
                (component) => component.ingresses.hasOwnProperty(exposedIngress.componentIngressName));

            if (matches.length === 1) {
                let ingress = matches[0].ingresses[exposedIngress.componentIngressName];

                let protocol: string;
                if (ingress.hasOwnProperty("basePath") && ingress.hasOwnProperty("definitions")) {
                    protocol = "http";
                } else {
                    protocol = "tcp";
                }

                ingresses.push({
                    ingress: ingress,
                    protocol: protocol,
                    isGlobal: exposedIngress.isGlobal
                });
            }
        });

        const templateContext = {
            [Constants.CellReferenceTemplate.CONTEXT_ORGANIZATION_NAME]: orgName,
            [Constants.CellReferenceTemplate.CONTEXT_NAME]: imageName,
            [Constants.CellReferenceTemplate.CONTEXT_VERSION]: imageVersion,
            [Constants.CellReferenceTemplate.CONTEXT_GATEWAY_PORT]: Constants.DEFAULT_GATEWAY_PORT,
            [Constants.CellReferenceTemplate.CONTEXT_INGRESSES]: ingresses
        };

        const convertToTitleCase = (text: string, separator: string | RegExp): string => {
            const wordsArray: string[] = text.split(separator);
            let convertedText = "";
            wordsArray.forEach((word) => {
                if (word.length >= 1) {
                    convertedText += word.substring(0, 1).toUpperCase();
                }
                if (word.length >= 2) {
                    convertedText += word.substring(1).toLowerCase();
                }
            });
            return convertedText;
        };

        Handlebars.registerHelper(Constants.CellReferenceTemplate.CONTEXT_HANDLE_API_NAME,
            (text) => convertToTitleCase(text, /\/|-/g));
        Handlebars.registerHelper(Constants.CellReferenceTemplate.CONTEXT_HANDLE_TYPE_NAME,
            (text) => convertToTitleCase(text, /-/g));

        const rawTemplate = fs.readFileSync(path.resolve(
            process.env[Constants.ENV_VAR_TS_CELLERY_DIR],
            "../../",
            Constants.RESOURCES_DIR,
            Constants.CellReferenceTemplate.FILE
        )).toString();
        const template = Handlebars.compile(rawTemplate);
        const cellReferenceFileContent = template(templateContext);

        const outputDir = process.env[Constants.ENV_VAR_OUTPUT_DIR];

        const typeScriptDir = path.resolve(outputDir, Constants.Project.Build.OUTPUT_DIR_TYPESCRIPT);
        mkdirp.sync(typeScriptDir);

        const cellReferenceFile = path.resolve(typeScriptDir, `${imageName}-ref.ts`);
        fs.writeFileSync(cellReferenceFile, cellReferenceFileContent);

        // Generate the package.json for the Cell Reference
        const packageJson = {
            name: `@${orgName}/${imageName}`,
            version: imageVersion,
            main: `./dist/${imageName}-ref.js`,
            scripts: {
                build: `tsc ${imageName}-ref.ts --outDir dist --target ES5 --module commonjs --declaration true`
            },
            dependencies: {
                typescript: "^3.2.4"
            }
        };
        const cellReferencePackageJsonFile = path.resolve(typeScriptDir, "package.json");
        fs.writeFileSync(cellReferencePackageJsonFile, JSON.stringify(packageJson));

        // Building the Cell Reference
        execSync("npm install", {cwd: typeScriptDir, stdio: "ignore"});
        execSync("npm run build", {cwd: typeScriptDir, stdio: "ignore"});

        // Generating the package
        execSync("npm pack", {cwd: typeScriptDir, stdio: "ignore"});
        const cellRefPackage = `${orgName}-${imageName}-${imageVersion}.tgz`;

        // Cleaning up the directory
        rimraf.sync(`${typeScriptDir}/**/*.ts`);
        rimraf.sync(`${typeScriptDir}/**/*.js`);
        rimraf.sync(`${typeScriptDir}/node_modules`);
        rimraf.sync(`${typeScriptDir}/dist`);
        rimraf.sync(`${typeScriptDir}/package*.json`);

        // Copying the ref package to Repository
        const refInstallationDIr = path.resolve(os.homedir(), ".cellery", "lang", "typescript", "repo",
            orgName, imageName, imageVersion);
        if (fs.existsSync(refInstallationDIr)) {
            rimraf.sync(refInstallationDIr);
        }
        mkdirp.sync(refInstallationDIr);
        fs.copyFileSync(
            path.resolve(typeScriptDir, cellRefPackage),
            path.resolve(refInstallationDIr, cellRefPackage)
        );
    }
}

export default CellImage;
