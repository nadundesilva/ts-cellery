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

import {V1ConfigMap, V1PodSpec, V1Secret} from "@kubernetes/client-node";
import PortMapping from "./PortMapping";
import VolumeClaim from "./VolumeClaim";
import ComponentScalingPolicy from "../scalingPolicy/ComponentScalingPolicy";

/**
 * Kubernetes Component resource spec model.
 */
class ComponentSpec {
    public readonly type: "Deployment" | "StatefulSet" | "Job";
    public readonly scalingPolicy: ComponentScalingPolicy;
    public readonly template: V1PodSpec;
    public readonly ports: PortMapping[];
    public readonly volumeClaims: VolumeClaim[];
    public readonly configurations: V1ConfigMap[];
    public readonly secrets: V1Secret[];
}

export default ComponentSpec;
