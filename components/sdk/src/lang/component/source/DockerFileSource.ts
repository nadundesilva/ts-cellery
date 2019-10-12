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

import { Docker } from 'docker-cli-js';
import ComponentSource from "./ComponentSource";

/**
 * Dockerfile based component source.
 *
 * The docker image is automatically built when the image is built.
 * The docker image is automatically pushed when the image is pushed.
 */
class DockerFileSource implements ComponentSource {
    public readonly dockerFileDir: string;
    public readonly tag: string;

    constructor(options: {dockerFileDir: string, tag: string}) {
        this.dockerFileDir = options.dockerFileDir;
        this.tag = options.tag;
    }

    public build(): Promise<null> {
        return new Promise((resolve, reject) => {
            const docker = new Docker();
            docker.command("build -t " + this.tag + " " + this.dockerFileDir)
                .then(() => {
                    resolve();
                })
                .catch((e) => {
                    reject(e);
                });
        });
    };

    public getImageTag(): string {
        return this.tag;
    }

    public isDockerPushRequired(): boolean {
        return true;
    }
}

export default DockerFileSource;
