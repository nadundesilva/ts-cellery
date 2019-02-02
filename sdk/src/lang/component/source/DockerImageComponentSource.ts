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

import DockerImage from "../../util/DockerImage";
import BaseComponentSource from "./BaseComponentSource";

/**
 * This is a Cellery Component Source which can be used for building components from docker images.
 */
class DockerImageComponentSource extends BaseComponentSource {
    private readonly image: DockerImage;

    constructor(image: string) {
        super();
        this.image = new DockerImage(image);
    }

    /**
     * Returns the docker image which is represented by this docker image source.
     *
     * @returns The docker image
     */
    public getDockerImage(): DockerImage {
        return this.image;
    }
}

export default DockerImageComponentSource;
