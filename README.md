Cellery Typescript
==================

  ![GitHub Actions Build Workflow Status](https://github.com/nadundesilva/ts-cellery/workflows/Build/badge.svg)
  [![GitHub Last Commit](https://img.shields.io/github/last-commit/nadundesilva/ts-cellery.svg)](https://github.com/nadundesilva/ts-cellery/commits/master)
  [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Prerequisites

* Node
* NPM

## Getting Started

1. Navigate to the sdk directory and initialize the SDK.
   ```
   cd <CELLERY_TYPESCRIPT_ROOT>/components/sdk
   npm install
   ```
2. Build and Package the SDK
   ```
   npm run build
   npm pack
   ```
3. Depending on your requirements follow one of the following.
   1. [Testing the provided samples](#testing-the-provided-samples)
   2. [Writing your own Cell](#writing-your-own-cell)

### Testing the provided samples

1. Navigate into the sample's cell.
   ```
   cd <CELLERY_TYPESCRIPT_ROOT>/samples/employee-portal/<CELL>
   ```
2. Install the SDK (Since this is not yet published)
   ```
   npm install <CELLERY_TYPESCRIPT_ROOT>/components/sdk/ts-cellery-sdk-<version>.tgz
   ```
4. Initialize the sample.
   ```
   npm install
   ```
3. Execute `npm run cellery:build -- myorg/<CELL>:0.1.0` to build the cell
4. Apply the Cell yaml found in `<CELL>/target/cellery/` directory

### Writing your own Cell

1. Create your own project by executing `npm init`
2. Install the SDK (Since this is not yet published)
   ```
   npm install <CELLERY_TYPESCRIPT_ROOT>/components/sdk/ts-cellery-sdk-<version>.tgz
   ```
3. Add the cellery section in `package.json` and point to the Cell file.
   ```json
   {
       "cellery": {
           "cell": "<path-to-cell-file>/<cell-file>.ts"
       }
   }
   ```
4. Write your Cell file. ([Install Cell References](#installing-a-cell-reference) if required)
5. Execute `npm run cellery:build -- <ORG_NAME>/<IMAGE_NAME>:<IMAGE_VERSION>` to build the cell
6. Apply the Cell yaml found in `<CELL>/target/cellery/` directory

**Note** If you are building Cell using Cell references, you need to build the dependent Cells and [Install the Reference](#installing-a-cell-reference) first.

## Installing a Cell Reference

1. Build the Cell you want to refer to.
2. Navigate to the directory containing the Cell you are writing
   ```
   cd <CELL_UNDER_CONSTRUCTION>
   ```
3. Install the Cell Reference.
   ```
   npm run cellery:installRef -- <ORG_NAME>/<IMAGE_NAME>:<IMAGE_VERSION>
   ```
4. Import the dependent Cell to your cell.<br>
   eg:-
   ```typescript
   import {EmployeeReference} from "@myorg/employee";
   ```
