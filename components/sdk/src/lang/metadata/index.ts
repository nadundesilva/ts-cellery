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

import ComponentMetaData from "./ComponentMetaData";

interface Metadata {
    readonly org: string;
    readonly name: string
    readonly ver: string
    readonly schemaVersion: "0.1.0";
    readonly kind: "Cell" | "Composite";
    readonly components: {[key: string]: ComponentMetaData};
    readonly buildTimestamp: number;
    readonly buildCelleryVersion: string;
    readonly zeroScalingRequired: boolean;
    readonly autoScalingRequired: boolean;
}

export default Metadata;
