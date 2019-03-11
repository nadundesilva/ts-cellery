Cellery Typescript
==================

## Getting Started

1. Navigate to the sdk directory and initialize the SDK.
   ```
   cd <CELLERY_TYPESCRIPT_ROOT>/components/sdk
   npm install
   ```
2. Build the SDK
   ```
   npm run build
   ```
3. Depending on your requirements follow one of the following.
   1. [Testing the provided samples](#testing-the-provided-samples)
   2. [Writing your own Cell](#writing-your-own-cell)

### Testing the provided samples

1. Navigate to the <CELLERY_TYPESCRIPT_ROOT> and run `npm install` to bootstrap the ts-cellery and link the samples with the SDK
2. Navigate into the sample's cell.
   ```
   cd <CELLERY_TYPESCRIPT_ROOT>/samples/employee-portal/<CELL>
   ```
3. Execute `npm run cellery:build -- <ORG_NAME> <IMAGE_NAME> <IMAGE_VERSION>` to build the cell

### Writing your own Cell

1. Navigate to the SDK and link the SDK (Since this is not yet published)
   ```
   cd <CELLERY_TYPESCRIPT>/components/sdk
   npm link
   ```
2. Create your own project by executing `npm init`
3. Add the cellery section in `package.json`
   ```json
   {
       "cellery": {
           "cell": "<path-to-cell-file>/<cell-file>.ts"
       }
   }
   ```
4. Add `ts-cellery` as a dependency.
5. Run `npm link @ts-cellery/sdk` to link the SDK to your Cell project
6. Write your Cell file and point to it from the `package.json` as mentioned in `3.`
7. Execute `npm run cellery:build -- <ORG_NAME> <IMAGE_NAME> <IMAGE_VERSION>` to build the cell
