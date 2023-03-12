import { BrowserWindow, app } from "electron";
import { join } from "node:path";

import bridge from "./bridge";
import prisma from "./util/prisma";
import logger from "./util/logger";

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
        icon: join(__dirname, "../public/favicon.ico")
    });

    (import.meta.env.DEV && process.env.VITE_DEV_SERVER_URL
        ? win.loadURL(process.env.VITE_DEV_SERVER_URL)
        : win.loadFile(join(__dirname, "../dist/index.html"))
    ).then(() => {
        logger.info("Window loaded");
        win?.show();
        win?.webContents.openDevTools({ mode: "detach" });
    });

    win?.on("closed", async () => {
        win = null;
        await prisma.$disconnect();
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
