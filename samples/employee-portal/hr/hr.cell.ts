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
import {EmployeeReference} from "@myorg/employee";
import {StockReference} from "@myorg/stock";

const hrComponent = new cellery.Component({
    name: "hr",
    source: {
        image: "docker.io/wso2vick/sampleapp-hr"
    },
    ingresses: {
        hr: {
            port: 8080,
            basePath: "hr-api",
            definitions: [
                {
                    path: "/",
                    method: cellery.http.Method.GET
                }
            ]
        }
    },
    parameters: {
        employeegw_url: new cellery.params.Env(),
        stockgw_url: new cellery.params.Env()
    }
});

export class HrCellImage extends cellery.CellImage {
    build(orgName: string, imageName: string, imageVersion: string): void {
        const employeeRef = new EmployeeReference("employee-inst");
        const stockRef = new StockReference("stock-inst");

        hrComponent.setParam("employeegw_url", employeeRef.getHost());
        hrComponent.setParam("stockgw_url", stockRef.getHost());

        this.addComponent(hrComponent);

        this.exposeGlobal(hrComponent);

        this.buildArtifacts(orgName, imageName, imageVersion);
    }
}
