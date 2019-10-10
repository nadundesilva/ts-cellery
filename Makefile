# --------------------------------------------------------------------
# Copyright (c) 2019, WSO2 Inc. (http://wso2.com) All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# -----------------------------------------------------------------------

PROJECT_ROOT := $(realpath $(dir $(abspath $(lastword $(MAKEFILE_LIST)))))
PROJECT_PKG := github.com/cellery-io/mesh-observability

VERSION := 0.1.0


all: init clean build



.PHONY: init
init: init.lang init.samples

.PHONY: clean
clean: clean.lang clean.samples

.PHONY: build
build: build.lang build.samples



.PHONY: init.lang
init.lang:
	cd components/sdk; \
	npm ci

.PHONY: init.samples
init.samples: build.lang
	cd samples/employee-portal/employee; \
	npm install ../../../components/sdk/ts-cellery-sdk-${VERSION}.tgz; \
	npm ci
	cd samples/employee-portal/stock; \
	npm install ../../../components/sdk/ts-cellery-sdk-${VERSION}.tgz; \
	npm ci
	cd samples/employee-portal/hr; \
	npm install ../../../components/sdk/ts-cellery-sdk-${VERSION}.tgz; \
	npm ci


.PHONY: clean.lang
clean.lang: init.lang
	cd components/sdk; \
	npm run clean

.PHONY: clean.samples
clean.samples: init.samples
	cd samples/employee-portal/employee; \
	rm -rf target
	cd samples/employee-portal/stock; \
	rm -rf target
	cd samples/employee-portal/hr; \
	rm -rf target


.PHONY: build.lang
build.lang: clean.lang
	cd components/sdk; \
	npm run build:prod

.PHONY: build.samples
build.samples: clean.samples build.lang
	cd samples/employee-portal/employee; \
	npm run cellery:build -- ts-cellery/employee-cell:${VERSION}
	cd samples/employee-portal/stock; \
	npm run cellery:build -- ts-cellery/stock-cell:${VERSION}
	cd samples/employee-portal/hr; \
	npm run cellery:build -- ts-cellery/hr-cell:${VERSION}
