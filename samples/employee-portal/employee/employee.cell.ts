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

export class EmployeeCell extends Cell {
    static readonly SALARY_CONTAINER_PORT = 8080;

    build(imageMetadata: ImageMeta): void {
        const salaryComponent: CellComponent = {
            name: "salary",
            source: new DockerImageSource({
                image: "wso2cellery/sampleapp-salary:0.3.0"
            }),
            ingresses: {
                salary: {
                    port: EmployeeCell.SALARY_CONTAINER_PORT,
                    context: "payroll",
                    expose: "local",
                    definition: {
                        resources: [
                            {
                                path: "/salary",
                                method: "GET"
                            }
                        ]
                    }
                }
            },
            labels: {
                team: "Finance",
                owner: "Alice"
            }
        };
        this.components.push(salaryComponent);

        const employeeComponent: CellComponent = {
            name: "employee",
            source: new DockerImageSource({
                image: "wso2cellery/sampleapp-employee:0.3.0"
            }),
            ingresses: {
                employee: {
                    port: 8080,
                    context: "employee",
                    expose: "local",
                    definition: {
                        resources: [
                            {
                                path: "/details",
                                method: "GET"
                            }
                        ]
                    }
                }
            },
            envVars: {
                SALARY_HOST: null,
                PORT: EmployeeCell.SALARY_CONTAINER_PORT
            },
            labels: {
                team: "HR"
            },
            dependencies:{
                components:[
                    salaryComponent
                ]
            }
        };
        this.components.push(employeeComponent);

        this.createImage(imageMetadata);
    }
}
