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

import {ImageMeta, Cell, CellComponent, DockerImageSource} from "@ts-cellery/sdk";

export class HrCell extends Cell {

    public async build(imageMetadata: ImageMeta) {
        const hrComponent: CellComponent = {
            name: "hr",
            source: new DockerImageSource({
                image: "docker.io/wso2vick/sampleapp-hr"
            }),
            ingresses: {
                hr: {
                    port: 8080,
                    context: "hr",
                    expose: "global",
                    definition: {
                        resources: [
                            {
                                path: "/",
                                method:"GET"
                            }
                        ]
                    }
                }
            },
            envVars: {
                employee_api_url: "",
                stock_api_url: ""
            },
            dependencies: {
                cells: {
                    employeeCell: "ts-cellery/employee:0.1.0",
                    stockCell: {
                        org: "ts-cellery",
                        name: "stock",
                        ver: "0.1.0"
                    }
                }
            }
        };
        this.components.push(hrComponent);

        this.globalPublisher = {
            apiVersion: "0.1.0",
            context: "employee-portal"
        };

        await this.createImage(imageMetadata);
    }
}
