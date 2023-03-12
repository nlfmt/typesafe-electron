# Typesafety for Electron Apps!

This template shows how you can achieve type safety for Electron IPC communication. \
By adding definitions of your IPC functions in one central file, you can get intellisense \
and type safety anywhere in your codebase.

## How to use

1. Clone this repository & install dependencies (any package manager will do, I use [`pnpm`](https://pnpm.io/)))
2. Create a new IPC API definition in the `electron/API.ts` file
    ```ts
    // electron/API.ts
    export type API = {
        myFunction: (arg: string) => Promise<string>
    }
    ```
3. Register a handler for the function, using the `bridge`.
    ```ts
    // electron/someModule.ts

    import bridge from './bridge'

    bridge.handle('myFunction', async (arg: string) => {
        return arg
    })
    ```
4. Use the function in your renderer process
    ```ts
    // src/SomeComponent.tsx

    import api from "@/api"

    api.myFunction('Hello World!').then(console.log)
    ```
5. Run the dev script to start the app
    ```
    pnpm dev
    ```

## What's included in this template? (Packages)

- vite
- typescript
- electron
- react
- less (easily exchangeable)
- prisma (easily exchangeable, but I recommend it)
- the-new-css-reset
    - This package resets CSS styles, you may prefer to use a different one.
    - to remove, delete the import in `src/inde.tsx` and uninstall the package
- svgr + vite svgr plugin
    - This package allows you to import SVGs as React components
    - to remove, remove the vite plugin from `vite.config.ts` and uninstall the package
- moment
  - This date package is used in my logger (`electron/util/logger.ts`), feel free to replace it with another one