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

import HTTPMethod from "../../util/HTTPMethod";
import BaseComponentIngress from "./BaseComponentIngress";

/**
 * HTTP Ingress API Definitions.
 */
class HTTPIngressDefinition {
    private readonly path: string;
    private readonly method: HTTPMethod;

    constructor(path: string, method: HTTPMethod) {
        this.path = path;
        this.method = method;
    }
}

/**
 * Component Ingress HTTP traffic.
 */
class HTTPComponentIngress extends BaseComponentIngress {
    public readonly port: number;
    public readonly basePath: string;
    public readonly definitions: HTTPIngressDefinition[];

    constructor(port: number, basePath: string, definitions: HTTPIngressDefinition[]) {
        super();
        this.port = Math.round(port);
        this.basePath = basePath;
        this.definitions = definitions;
    }

    /**
     * Expose the Component API Globally
     */
    public exposeGlobally(): void {
        // TODO: Expose Ingress Globally
    }
}

export default HTTPComponentIngress;
export {HTTPIngressDefinition};
