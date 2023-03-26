import builder, { Configuration } from "electron-builder";
import { join, relative, dirname } from "path";
import { fileURLToPath } from "url";
import moment from "moment";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appId = "com.example.app";
const productName = "Example App";

const icon = "resources/favicon.ico";
const macIcon = "resources/favicon.icns";

if (process.env.VITE_APP_VERSION === undefined) {
    const m = moment();
    process.env.VITE_APP_VERSION = `${m.format("YYYY.M.D")}-${m.hours()*60+m.minutes()}`
}

const config: Configuration = {
    appId, productName, icon,
    asar: true,

    directories: {
        output: "dist",
        buildResources: "resources"
    },
    files: [
        // { from: "build/electron", to: "electron" },
        // { from: "build/renderer", to: "renderer" },
        "build/electron",
        "build/renderer",
        "package.json"
    ],
    extraMetadata: {
        version: process.env.VITE_APP_VERSION
    },
    win: {
        target: ["nsis", "zip"],
        icon,
        requestedExecutionLevel: "asInvoker"
    },
    linux: {
        target: ["AppImage", "tar.gz"],
    },
    mac: {
        target: ["dmg", "zip"],
        icon: macIcon,
    }

};

builder
    .build({
        config,
        dir: true
    })
    .then((result) => {
        console.log(JSON.stringify(result));
    })
    .catch((error) => {
        console.error(error);
    });
