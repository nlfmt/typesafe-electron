import type { Callback } from "./bridge"


/**
 * API Functions that can be called by the renderer process
 * Uses `invoke` under the hood, so the return value is a Promise
 */
export type API = {
    /** Minimizes the application window */
    minimize: () => Promise<void>
    /** Maximizes the application window */
    maximize: () => Promise<void>
    /** Closes the application window */
    close: () => Promise<void>

    // TODO: define your API here
}


/**
 * Named events that can be emitted by the main process
 */
export type EVENT_FROM_MAIN = {
    // example: (data: string) => void
}


/**
 * Named events that can be emitted by the renderer process
 */
export type EVENT_FROM_RENDERER = {

}