import type { API, EVENT_FROM_MAIN, EVENT_FROM_RENDERER } from "../../electron/API";
import type { Callback } from "../../electron/bridge";
type FN_NAMES = keyof API;

declare global {
    const bridge: {
        /** Call an electron function defined in the `API` type */
        call: <T extends FN_NAMES>(name: T, ...args: Parameters<API[T]>) => ReturnType<API[T]>;
        /** Send an event defined in `EVENT_FROM_RENDERER` to the electron main process */
        send: <T extends keyof EVENT_FROM_RENDERER>(name: T, data: EVENT_FROM_RENDERER[T]) => void;
        /** Listen to an event defined in `EVENT_FROM_MAIN` from the electron main process */
        on: <T extends keyof EVENT_FROM_MAIN>(name: T, fn: (...args: Parameters<EVENT_FROM_MAIN[T]>) => void) => void;
        /** Listen to an event defined in `EVENT_FROM_MAIN` from the electron main process, but only once */
        once: <T extends keyof EVENT_FROM_MAIN>(name: T, fn: (...args: Parameters<EVENT_FROM_MAIN[T]>) => void) => void;
        /** Remove a listener from an event defined in `EVENT_FROM_MAIN` from the electron main process */
        off: <T extends keyof EVENT_FROM_MAIN>(name: T, fn: (...args: Parameters<EVENT_FROM_MAIN[T]>) => void) => void;
        /** Create a callback for the main process to call */
        callback: <T extends (...args: any[]) => void>(fn: T) => Callback<T>;
    }
}