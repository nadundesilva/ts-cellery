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

import ComponentSource from "./source";
import Dependencies from "./Dependencies";
import AutoScalingPolicy from "./scalingPolicy/AutoScalingPolicy";
import ZeroScalingPolicy from "./scalingPolicy/ZeroScalingPolicy";
import HealthProbes from "./health/HealthProbes";
import Resources from "./resources/Resources";
import VolumeMount from "./volumes/VolumeMount";

/**
 * Component deployed as part of an instance.
 */
interface BaseComponent {
    readonly name: string;
    readonly source: ComponentSource;
    readonly replicas?: number;
    readonly labels?: { [key: string]: string };
    readonly envVars?: { [key: string]: (string | number | boolean | null) };
    readonly dependencies?: Dependencies;
    readonly scalingPolicy?: AutoScalingPolicy | ZeroScalingPolicy;
    readonly probes?: HealthProbes;
    readonly resources?: Resources;
    readonly componentType?: "Job" | "Deployment" | "StatefulSet";
    readonly volumes?: { [key: string]: VolumeMount };
}

export default BaseComponent;
