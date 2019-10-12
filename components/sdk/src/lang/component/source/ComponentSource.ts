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

/**
 * Component Source which represents a container which can be deployed in Kubernetes.
 */
interface ComponentSource {

    /**
     * Build the component source.
     *
     * @returns A promise which resolves once build is complete.
     */
    build(): Promise<null>;

    /**
     * Get the image tag.
     *
     * @returns The image tag.
     */
    getImageTag(): string;

    /**
     * Check if docker push is required.
     *
     * @returns True if docker push is required.
     */
    isDockerPushRequired(): boolean;
}

export default ComponentSource;
