Cellery Typescript
==================

  ![GitHub Actions Build Workflow Status](https://github.com/nadundesilva/ts-cellery/workflows/Build/badge.svg)
  [![GitHub Last Commit](https://img.shields.io/github/last-commit/nadundesilva/ts-cellery.svg)](https://github.com/nadundesilva/ts-cellery/commits/master)
  [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## Prerequisites

* Node
* NPM

## Getting Started

1. Build and Package the SDK
   ```
   make build.lang
   ```
2. Depending on your requirements follow one of the following.
   1. [Testing the provided samples](#testing-the-provided-samples)
   2. [Writing your own Cell](#writing-your-own-cell)

### Testing the provided samples

1. Initialize the samples.
   ```
   make init.samples
   ```
2. Execute `npm run cellery:build -- myorg/<CELL>:0.1.0` to build the cell
3. Apply the Cell yaml found in `<CELL>/target/cellery/` directory

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
4. Write your Cell file.
5. Execute `npm run cellery:build -- <ORG_NAME>/<IMAGE_NAME>:<IMAGE_VERSION>` to build the cell
6. Apply the Cell yaml found in `<CELL>/target/cellery/` directory
