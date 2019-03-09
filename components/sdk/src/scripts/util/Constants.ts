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
    public static readonly RESOURCES_DIR = "../../resources";
    public static readonly ENV_VAR_OUTPUT_DIR = "CELLERY_ENV_VAR_OUTPUT_DIR";

    public static readonly Project = class Project {
        public static readonly PACKAGE_JSON_FILE_NAME = "package.json";
        public static readonly TS_CONFIG_FILE_NAME = "tsconfig.json";
        public static readonly CELLERY_CONFIG_SECTION_KEY = "cellery";

        public static readonly Build = class Build {
            public static readonly OUTPUT_DIR = "target";
            public static readonly OUTPUT_DIR_CELLERY = "cellery";
        }
    };
}

export default Constants;
