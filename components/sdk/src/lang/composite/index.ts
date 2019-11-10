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

import Component from "./Component";
import BaseInstance from "../BaseInstance";
import ImageMeta from "../ImageMeta";
import LangUtils from "../util/LangUtils";
import * as log from "log";

/**
 * Cellery Composite.
 *
 * This should be extended and implemented when creating Composites.
 */
abstract class Composite extends BaseInstance {
    public readonly components: Component[] = [];

    /**
     * Build the image.
     *
     * @param imageMetadata The image metadata passed by the invoker
     */
    protected async createImage(imageMetadata: ImageMeta) {
        log.debug(`Creating Composite Image: ${JSON.stringify(imageMetadata)}`);
        LangUtils.saveBuildSnapshot(imageMetadata, this);
        await LangUtils.generateMetadata(imageMetadata, this);
        await LangUtils.generateReference(this);
        await LangUtils.saveImageToLocalRepository(imageMetadata);
    }
}

export default Composite;
export {Component};
