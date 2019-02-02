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

import {Component} from "../component";
import {BaseCellAPI} from "./api";
import CellEgress from "./CellEgress";

/**
 * Class for defining Cell image.
 */
abstract class CellImage {
    protected readonly name: string;
    protected readonly components: Component[] = [];
    protected readonly apis: BaseCellAPI[] = [];
    protected readonly egresses: CellEgress[] = [];

    protected constructor(name: string) {
        this.name = name;
    }
}

export default CellImage;
