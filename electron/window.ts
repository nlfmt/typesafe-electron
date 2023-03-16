import { BrowserWindow, app } from "electron";
import { join } from "node:path";

import bridge from "./bridge";

let win: BrowserWindow | null = null;

export function createWindow() {
    win = new BrowserWindow({
        title: "Main Window",
        show: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            preload: join(__dirname, "./bridge/preload.js")
        },
        frame: false,
        icon: join(__dirname, "../../resources/favicon.ico")
    });

    (import.meta.env.DEV && process.env.VITE_DEV_SERVER_URL
        ? win.loadURL(process.env.VITE_DEV_SERVER_URL)
        : win.loadFile(join(__dirname, "../renderer/index.html"))
    ).then(() => {
        win?.show();
        win?.webContents.openDevTools({ mode: "detach", activate: false });
    });

    win?.on("closed", async () => {
        win = null;
        app.quit();
    });
}

bridge.handle("minimize", async () => {
    win?.minimize();
});

bridge.handle("maximize", async () => {
    if (win?.isMaximized()) {
        win?.restore();
    } else {
        win?.maximize();
    }
});

bridge.handle("close", async () => {
    win?.close();
});
