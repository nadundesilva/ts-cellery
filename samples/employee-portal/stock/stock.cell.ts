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

const stockComponent: cellery.Component = {
    name: "stock",
    source: {
        image: "docker.io/wso2vick/sampleapp-stock"
    },
    ingresses: {
        stock: {
            port: 8080,
            basePath: "stock",
            definitions: [
                {
                    path: "/",
                    method: cellery.http.Method.GET
                }
            ]
        }
    }
};

export class StockCellImage extends cellery.CellImage {
    build(orgName: string, imageName: string, imageVersion: string): void {
        this.addComponent(stockComponent);

        this.expose(stockComponent);

        this.buildArtifacts(orgName, imageName, imageVersion);
    }
}