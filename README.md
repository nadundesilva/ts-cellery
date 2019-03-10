Cellery Typescript
==================

## Getting Started

### Testing the provided samples

1. Run `npm install` to bootstrap the ts-cellery and link the samples with the SDK
2. Navigate into the sample's cell.
   ```
   cd <CELLERY_TYPESCRIPT_ROOT>/samples/employee-portal/<CELL>
   ```
3. Execute `npm run cellery:build` to build the cell

### Writing your own Cell

1. Link the SDK (Since this is not yet published)
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
5. Run `npm link ts-cellery` to link the SDK to your Cell project
