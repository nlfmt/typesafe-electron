import { contextBridge, ipcRenderer } from "electron";
import type { Callback } from "./index";


let callback_id = 0;
function createCallback<T extends (...args: any[]) => void>(fn: T): Callback<T> {
    const name = "_CALLBACK_" + callback_id++;
    const cb = (e: Electron.IpcRendererEvent, ...args: any[]) => fn(...args);
    ipcRenderer.on(name, cb);
    ipcRenderer.once(name + "_REMOVE", () => ipcRenderer.off(name, cb));
    
    return { name };
}

contextBridge.exposeInMainWorld("bridge", {
    call: (name: string, ...args: any[]) => {
        return ipcRenderer.invoke(name, ...args);
    },
    send: (name: string, data: any) => {
        ipcRenderer.send(name, data);
    },
    on: (name: string, fn: (...args: any[]) => void) => {
        ipcRenderer.on(name, (_, ...args) => fn(...args));
    },
    once: (name: string, fn: (...args: any[]) => void) => {
        ipcRenderer.once(name, (_, ...args) => fn(...args));
    },
    off: (name: string, fn: (...args: any[]) => void) => {
        ipcRenderer.off(name, (_, ...args) => fn(...args));
    },
    callback: createCallback,
});
