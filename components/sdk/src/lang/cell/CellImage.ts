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

import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as kubernetes from "../../kubernetes";
import Constants from "../../util/Constants";
import {Component} from "../component";
import CellIngress from "./CellIngress";

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
            (existingComponent) => existingComponent.spec.name === component.spec.name).length;
        if (matchCount === 0) {
            this.components.push(component);
        } else {
            throw Error(`Component ${component.spec.name} already exists`);
        }
    }

    /**
     * Expose all the ingresses of a component at Cell Level.
     *
     * @param component Component of which the ingresses should be exposed.
     */
    protected expose(component: Component): void {
        Object.keys(component.spec.ingresses).forEach((ingressName) => {
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
        Object.keys(component.spec.ingresses).forEach((ingressName) => {
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
}

export default CellImage;
