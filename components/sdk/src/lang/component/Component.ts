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

import {ComponentIngress} from "./ingress";
import {Param} from "./params";
import {ComponentSource} from "./source";

/**
 * Cellery Component Spec.
 */
interface ComponentSpec {
    readonly name: string;
    readonly source: ComponentSource;
    readonly ingresses: { [key: string]: ComponentIngress };
    readonly replicas?: number;
    readonly labels?: { [key: string]: string };
    readonly parameters?: {[key: string]: Param };
}

/**
 * Cellery Component.
 */
class Component {
    public readonly spec;

    constructor(spec: ComponentSpec) {
        this.spec = spec;
    }

    public getHost(cellInstanceName: string): string {
        return cellInstanceName + "--" + this.spec.name + "-service";
    }

    public setParam(key: string, value: any) {
        this.spec.parameters[key].value = value;
    }
}

export default Component;
