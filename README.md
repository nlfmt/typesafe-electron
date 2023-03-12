# Typesafety for Electron Apps!

This template show how you can achieve type safety for Electron IPC communication. \
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