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

import * as cellery from "@ts-cellery/sdk";

const employeeComponent: cellery.Component = {
    name: "employee",
    source: {
        image: "docker.io/wso2vick/sampleapp-employee"
    },
    ingresses: {
        employee: {
            port: 8080,
            basePath: "employee",
            definitions: [
                {
                    path: "/details",
                    method: cellery.http.Method.GET
                }
            ]
        }
    },
    parameters: {
        SALARY_HOST: new cellery.params.Env(),
        PORT: new cellery.params.Env(8080)
    },
    labels: {
        [cellery.Labels.TEAM]: "HR"
    }
};

const salaryComponent: cellery.Component = {
    name: "salary",
    source: {
        image: "docker.io/wso2vick/sampleapp-salary"
    },
    ingresses: {
        salary: {
            port: 8080,
            basePath: "payroll",
            definitions: [
                {
                    path: "/salary",
                    method: cellery.http.Method.GET
                }
            ]
        }
    },
    labels: {
        [cellery.Labels.TEAM]: "Finance",
        [cellery.Labels.OWNER]: "Alice"
    }
};

export class EmployeeCellImage extends cellery.CellImage {
    build(orgName: string, imageName: string, imageVersion: string): void {
        employeeComponent.parameters.SALARY_HOST.value
            = imageName + "--" + salaryComponent.name + "-service";

        this.addComponent(employeeComponent);
        this.addComponent(salaryComponent);

        this.expose(employeeComponent);

        this.buildArtifacts(orgName, imageName, imageVersion);
    }
}
