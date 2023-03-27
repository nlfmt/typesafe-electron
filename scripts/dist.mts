import builder, { Configuration } from "electron-builder";
import moment from "moment";


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
    nsis: {
        oneClick: false,
        perMachine: true,
        allowToChangeInstallationDirectory: true,
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
        shortcutName: productName,
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
    })
    .then((result) => {
        console.log(JSON.stringify(result));
    })
    .catch((error) => {
        console.error(error);
    });
