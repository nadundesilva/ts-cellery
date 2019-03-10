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

import CellIngress from "../../lang/cell/CellIngress";
import Constants from "./Constants";
import HttpGateway from "../gateway/http";
import HttpComponentIngress from "../../../dist/lang/component/ingress/http/HttpComponentIngress";
import Index from "../cell";
import Service from "../service";
import {Component, ComponentIngress} from "../../lang";
import * as yaml from "js-yaml";

/**
 * Kubernetes Cell Resource builder.
 */
class CellBuilder {
    private readonly orgName: string;
    private readonly name: string;
    private readonly version: string;
    private readonly components: Component[] = [];
    private readonly exposedIngresses: CellIngress[] = [];

    constructor(orgName: string, name: string, version: string) {
        this.orgName = orgName;
        this.name = name;
        this.version = version;
    }

    /**
     * Add components to the Cell Resource builder.
     *
     * @param components Components to be added
     * @returns The Cell Builder instance to be chained
     */
    public withComponents(components: Component[]): CellBuilder {
        const self = this;
        components.forEach((component) => {
            self.components.push(component);
        });
        return this;
    };

    /**
     * Add exposed ingresses to the Cell Resource builder.
     *
     * @param ingresses Exposed ingresses to be added
     * @returns The Cell Builder instance to be chained
     */
    public withExposedIngresses(ingresses: CellIngress[]): CellBuilder {
        const self = this;
        ingresses.forEach((ingress) => {
            self.exposedIngresses.push(ingress);
        });
        return this;
    }

    /**
     * Build the Cell resource.
     *
     * @returns The Cell Artifact content
     */
    public build(): string {
        const services: Service[] = [];
        this.components.forEach((component) => {
            services.push({
                metadata: {
                    name: component.name,
                    labels: (component.labels ? component.labels : {})
                },
                spec: {
                    container: {
                        image: component.source.image,
                        ports: Object.keys(component.ingresses).map((componentIngressName) => {
                            const componentIngress = component.ingresses[componentIngressName];
                            return {
                                containerPort: componentIngress.port
                            };
                        })
                    },
                    servicePort: 80,
                    replicas: (component.replicas ? component.replicas : 1)
                }
            });
        });

        const httpGateways: HttpGateway[] = [];
        this.exposedIngresses.forEach((exposedIngress) => {
            const componentMatches = this.components.filter(
                (component) => component.ingresses.hasOwnProperty(exposedIngress.componentIngressName));

            let component: Component;
            let ingress: ComponentIngress;
            if (componentMatches.length === 1) {
                component = componentMatches[0];
                ingress = component.ingresses[exposedIngress.componentIngressName];
            } else {
                throw Error(`Duplicate ingress name ${exposedIngress.componentIngressName} cannot be used`);
            }

            if (ingress.hasOwnProperty("basePath") && ingress.hasOwnProperty("definitions")) {
                const httpComponentIngress = <HttpComponentIngress>ingress;
                httpGateways.push({
                    context: httpComponentIngress.basePath,
                    backend: component.name,
                    definitions: httpComponentIngress.definitions.map((apiDefinition) => ({
                        method: <string><unknown>apiDefinition.method,
                        path: apiDefinition.path
                    })),
                    global: exposedIngress.isGlobal
                });
            }
        });

        const cell: Index = {
            apiVersion: Constants.CELL_RESOURCE_API_VERSION,
            kind: Constants.CELL_RESOURCE_KIND,
            metadata: {
                name: this.name,
                annotations: {
                    [Constants.CELL_RESOURCE_ANNOTATION_IMAGE_ORG]: this.orgName,
                    [Constants.CELL_RESOURCE_ANNOTATION_IMAGE_NAME]: this.name,
                    [Constants.CELL_RESOURCE_ANNOTATION_IMAGE_VERSIOn]: this.version
                }
            },
            spec: {
                gatewayTemplate: {
                    spec: {
                        http: httpGateways
                    }
                },
                servicesTemplates: services
            }
        };
        return yaml.safeDump(cell);
    }
}

export default CellBuilder;
