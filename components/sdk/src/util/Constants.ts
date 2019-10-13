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

import * as path from "path";

/**
 * Constants related to Cellery Scripts.
 */
class Constants {
    public static readonly VERSION = "0.1.0";
    public static readonly ENV_VAR_OUTPUT_DIR = "CELLERY_ENV_VAR_OUTPUT_DIR";
    public static readonly TS_CONFIG = "resources/tsconfig.cell.json";

    public static readonly CELLERY_ID_PATTERN = "[a-z0-9]+(-[a-z0-9]+)*";
    public static readonly INSTANCE_COMPONENT_SEPARATOR = "--";
    public static readonly GATEWAY = "gateway";
    public static readonly IMAGE_VERSION_PATTERN =
        "[a-z0-9]+((?:-|.)[a-z0-9]+)*";
    public static readonly CELL_IMAGE_PATTERN =
        Constants.CELLERY_ID_PATTERN +
        "\\/" +
        Constants.CELLERY_ID_PATTERN +
        ":" +
        Constants.IMAGE_VERSION_PATTERN;
    public static readonly USER_HOME =
        process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    public static readonly CELLERY_LOCAL_REPO = path.resolve(
        Constants.USER_HOME,
        ".cellery/repo"
    );

    /**
     * Cellery project related constants.
     */
    public static readonly Project = class Project {
        public static readonly PACKAGE_JSON_FILE_NAME = "package.json";
        public static readonly CELLERY_CONFIG_SECTION_KEY = "cellery";

        /**
         * Cellery project build related constants.
         */
        public static readonly Build = class Build {
            public static readonly OUTPUT_DIR = "target";
        };
    };

    /**
     * Image related constants.
     */
    public static readonly Image = class Image {
        public static readonly SRC_DIR = "src";
        public static readonly SNAPSHOT_FILE =
            "artifacts/typescript/snapshot.json";
        public static readonly METADATA_FILE =
            "artifacts/cellery/metadata.json";
        public static readonly REFERENCE_FILE = "artifacts/ref/reference.json";
        public static readonly INSTANCE_PLACEHOLDER = "{{instance_name}}";
    };

    /**
     * Ingress related constants.
     */
    public static readonly Ingress = class Ingress {
        public static readonly HTTP_INGRESS_DEFAULT_PROTOCOL = "http";
        public static readonly HTTP_INGRESS_DEFAULT_PORT = 80;

        /**
         * Ingress Types related constants.
         */
        public static readonly Type = class Type {
            public static readonly TCP = "TCP";
            public static readonly HTTP = "HTTP";
            public static readonly GRPC = "GRPC";
            public static readonly WEB = "WEB";
        };
    };

    /**
     * Scaling policy related constants.
     */
    public static readonly ScalingPolicy = class ScalingPolicy {
        public static readonly AUTO_SCALING = "AutoScaling";
        public static readonly ZERO_SCALING = "ZeroScaling";
    };
}

export default Constants;
