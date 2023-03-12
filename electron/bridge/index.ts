import { BrowserWindow, ipcMain } from "electron";
import type { API, EVENT_FROM_MAIN, EVENT_FROM_RENDERER } from "../API";


type FN_NAMES = keyof API;
type AnyFn = (...args: any[]) => any;


/**
 * A callback function provided by the renderer process that can be called by the main process
 * Creates a new IPC channel for each callback
 */
export type Callback<T extends (...args: any[]) => void> = {
    name: string,
}


function sendToAllWindows(channel: string, ...args: any[]) {
    for (const win of BrowserWindow.getAllWindows())
        win.webContents.send(channel, ...args);
}


/**
 * Only allow senders from file protocol or from dev server.
 */
function validateSender(frame: Electron.WebFrameMain): boolean {
    if (import.meta.env.DEV && process.env.VITE_DEV_SERVER_URL) return true;

    const frameUrl = new URL(frame.url);
    if (frameUrl.protocol == "file:") return true;

    return false;
}


/**
 * Handle an IPC call from the renderer process
 * @param name The name of the IPC channel
 * @param fn The function to call when the IPC call is received
 */
function handle<T extends FN_NAMES>(name: T, fn: API[T]) {
    ipcMain.handle(name, async (e, ...args) => {
        if (!validateSender(e.senderFrame)) return;
        return (fn as AnyFn)(...args);
    });
}


/**
 * Handle an IPC call from the renderer process, but only once
 * @param name The name of the IPC channel
 * @param fn The function to call when the IPC call is received
 */
function handleOnce<T extends FN_NAMES>(name: T, fn: API[T]) {
    ipcMain.handleOnce(name, async (e, ...args) => {
        if (!validateSender(e.senderFrame)) return;
        return (fn as AnyFn)(...args);
    });
}


/**
 * Emit an event to the renderer process
 * @param name The name of the event
 * @param args The arguments to pass to the event
 */
function emit<T extends keyof EVENT_FROM_MAIN>(name: T, ...args: Parameters<EVENT_FROM_MAIN[T]>) {
    sendToAllWindows(name, ...args);
}


/**
 * Listen for an event from the renderer process
 * @param name The name of the event
 * @param fn The function to call when the event is received
 */
function on<T extends keyof EVENT_FROM_RENDERER>(name: T, fn: (data: EVENT_FROM_RENDERER[T]) => void) {
    ipcMain.on(name, (e, data) => {
        if (!validateSender(e.senderFrame)) return;
        fn(data);
    });
}


/**
 * Listen for an event from the renderer process, but only once
 * @param name The name of the event
 * @param fn The function to call when the event is received
 */
function once<T extends keyof EVENT_FROM_RENDERER>(name: T, fn: (data: EVENT_FROM_RENDERER[T]) => void) {
    ipcMain.once(name, (e, data) => {
        if (!validateSender(e.senderFrame)) return;
        fn(data);
    });
}


/**
 * Remove a listener for an event from the renderer process
 * @param name The name of the event
 * @param fn The function to remove
 */
function removeListener<T extends keyof EVENT_FROM_RENDERER>(name: T, fn: (data: EVENT_FROM_RENDERER[T]) => void) {
    ipcMain.removeListener(name, (e, data) => {
        if (!validateSender(e.senderFrame)) return;
        fn(data);
    });
}


/**
 * Remove all listeners for an event from the renderer process
 */
function removeAllListeners<T extends keyof EVENT_FROM_RENDERER>(name: T) {
    ipcMain.removeAllListeners(name);
}


/**
 * Dispatch a callback to the renderer process
 * @param callback The callback to dispatch
 * @param args 
 */
function execCallback<T extends (...args: any[]) => void>(callback: Callback<T>, ...args: Parameters<T>) {
    sendToAllWindows(callback.name, ...args);
}


/**
 * Remove a callback from the renderer process
 * @param callback The callback to remove
 */
function removeCallback(callback: Callback<AnyFn>) {
    sendToAllWindows(callback.name + "_REMOVE");
}

/**
 * The bridge between the main process and the renderer process
 * Provides functions to be called from the renderer process and
 * events to be emitted from the main process
 */
export default {
    handle, handleOnce,
    emit, on, once,
    removeListener, off: removeListener, removeAllListeners,
    execCallback, removeCallback
}