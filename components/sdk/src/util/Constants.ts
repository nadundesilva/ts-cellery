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
 * Constants related to Cellery Scripts.
 */
class Constants {
    public static readonly RESOURCES_DIR = "resources";
    public static readonly ENV_VAR_OUTPUT_DIR = "CELLERY_ENV_VAR_OUTPUT_DIR";
    public static readonly ENV_VAR_TS_CELLERY_DIR =
        "CELLERY_ENV_VAR_TS_CELLERY_DIR";
    public static readonly TS_CONFIG_FILE_NAME = "tsconfig.cell.json";

    public static readonly DEFAULT_GATEWAY_PORT = 80;

    public static readonly CELLERY_ID_PATTERN = "[a-z0-9]+(-[a-z0-9]+)*";
    public static readonly IMAGE_VERSION_PATTERN = "[0-9]+\\.[0-9]+\\.[0-9]+";
    public static readonly CELL_IMAGE_PATTERN =
        Constants.CELLERY_ID_PATTERN +
        "\\/" +
        Constants.CELLERY_ID_PATTERN +
        ":" +
        Constants.IMAGE_VERSION_PATTERN;

    /**
     * Cell reference related constants.
     */
    public static readonly CellReferenceTemplate = class CellReferenceTemplate {
        public static readonly FILE = "cell-reference.ts.handlebars";
        public static readonly CONTEXT_ORGANIZATION_NAME = "cellOrg";
        public static readonly CONTEXT_NAME = "cellName";
        public static readonly CONTEXT_VERSION = "cellVersion";
        public static readonly CONTEXT_GATEWAY_PORT = "cellGatewayPort";
        public static readonly CONTEXT_INGRESSES = "ingresses";
        public static readonly CONTEXT_HANDLE_API_NAME = "handleApiName";
        public static readonly CONTEXT_HANDLE_TYPE_NAME = "handleTypeName";
    };

    /**
     * Kubernetes runtime related constants.
     */
    public static readonly Kubernetes = class Kubernetes {
        public static readonly CELL_RESOURCE_API_VERSION =
            "mesh.cellery.io/v1alpha1";
        public static readonly CELL_RESOURCE_KIND = "Cell";
        public static readonly CELL_RESOURCE_ANNOTATION_IMAGE_ORG =
            "mesh.cellery.io/cell-image-org";
        public static readonly CELL_RESOURCE_ANNOTATION_IMAGE_NAME =
            "mesh.cellery.io/cell-image-name";
        public static readonly CELL_RESOURCE_ANNOTATION_IMAGE_VERSIOn =
            "mesh.cellery.io/cell-image-version";
    };

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
            public static readonly OUTPUT_DIR_CELLERY = "cellery";
            public static readonly OUTPUT_DIR_TYPESCRIPT = "typescript";
        };
    };
}

export default Constants;
