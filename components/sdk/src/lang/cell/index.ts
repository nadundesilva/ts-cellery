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

import GlobalApiPublisher from "./GlobalApiPublisher";
import ImageMeta from "../ImageMeta";
import Component from "./Component";
import BaseInstance from "../BaseInstance";
import LangUtils from "../util/LangUtils";

/**
 * Cellery Cell.
 *
 * This should be extended and implemented when creating Cells.
 */
abstract class Cell extends BaseInstance {
    public components: Component[] = [];
    public globalPublisher: GlobalApiPublisher = null;

    /**
     * Build the image.
     *
     * @param imageMetadata The image metadata passed by the invoker
     */
    protected async createImage(imageMetadata: ImageMeta) {
        LangUtils.saveBuildSnapshot(imageMetadata, this);
        await LangUtils.generateMetadata(imageMetadata, this);
        await LangUtils.saveImageToLocalRepository(imageMetadata, this);
    }
}

export default Cell;
export {Component, GlobalApiPublisher};
