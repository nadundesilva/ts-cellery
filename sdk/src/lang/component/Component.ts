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

import {BaseComponentAPI} from "./api";
import ComponentEgress from "./ComponentEgress";
import {BaseComponentSource} from "./source";

/**
 * Class defining a Cellery Component.
 */
abstract class Component {
    protected readonly name: string;
    protected readonly source: BaseComponentSource;
    protected readonly replicas: number = 1;
    protected readonly apis: { [key: string]: BaseComponentAPI } = {};
    protected readonly env: { [key: string]: string } = {};
    protected readonly egresses: ComponentEgress[] = [];
    protected readonly labels: { [key: string]: number } = {};

    protected constructor(name: string, source: BaseComponentSource) {
        this.name = name;
        this.source = source;
    }

    public run() {
        this.startComponentInstance();
    }

    /**
     * Start a component of this instance.
     */
    protected startComponentInstance() {
        // TODO : Generate YAML and apply
    }

    /**
     * Set an environment var in the component.
     *
     * @param key The key of the environment variable
     * @param value The value of the environment variable
     */
    protected setEnvVar(key: string, value: string) {
        this.env[key] = value;
    }
}

export default Component;
