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

import Constants from "./Constants";
import * as tmp from "tmp";
import * as path from "path";
import * as extractZip from "extract-zip";
import * as fse from "fs-extra";

/**
 * Common Utilities.
 */
class Utils {
    /**
     * Parse the cell image name in the format org/name:version and return and object containing
     * the image name information.
     *
     * @param name The name of the image in the format org/name:version
     */
    public static parseCellImageName(
        name: string
    ): { orgName: string; imageName: string; imageVersion: string } {
        if (name == "") {
            throw Error("Image name cannot be empty");
        } else if (!name.match(Constants.CELL_IMAGE_PATTERN)) {
            throw Error(`Invalid image ${name}`);
        }

        // Parsing the cell image string
        const nameSplit = name.split("/");
        const cellImage = {
            orgName: "",
            imageName: "",
            imageVersion: ""
        };
        if (nameSplit.length == 2) {
            cellImage.orgName = nameSplit[0];
            const imageNameSplit = nameSplit[1].split(":");
            if (imageNameSplit.length != 2) {
                throw Error("Invalid image format");
            }
            cellImage.imageName = imageNameSplit[0];
            cellImage.imageVersion = imageNameSplit[1];
        } else {
            throw Error("Invalid image format");
        }
        return cellImage;
    }

    /**
     * Extract a Image to a temporary directory.
     *
     * @param orgName Name of the organization the image belongs to
     * @param imageName Name of the image
     * @param imageVersion Version of the image
     * @returns A promise which resolves to the path of the temporary location to which the image was extracted
     */
    public static extractCellImage(
        orgName: string,
        imageName: string,
        imageVersion: string
    ): Promise<string> {
        const tmpDir = tmp.dirSync({
            prefix: "cellery-image-"
        }).name;
        const imageFromLocalRepo = path.resolve(
            Constants.CELLERY_LOCAL_REPO,
            orgName,
            imageName,
            imageVersion,
            `${imageName}.zip`
        );
        if (!fse.existsSync(imageFromLocalRepo)) {
            throw Error(
                "Unable to locate image in the local image repository. Please build or pull all the dependencies"
            );
        }
        return new Promise((resolve, reject) => {
            extractZip(imageFromLocalRepo, { dir: tmpDir }, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(tmpDir);
                }
            });
        });
    }
}

export default Utils;
