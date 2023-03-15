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

// console.log({
//     extraResources: [
//         "resources/db.sqlite",
//         "prisma\\**",
//         {
//             from: relative(__dirname, join(fs.realpathSync("node_modules/prisma/prisma-client"), "/**/*")),
//             to: "prisma-client",
//         },
//         join(fs.realpathSync("node_modules/@prisma/client"), "/**/*"),
//     ],
// });

const extraResources = [
    "resources/db.sqlite",
    // {
    //     from: join(fs.realpathSync("node_modules/prisma"), "../@prisma/**/*"),
    //     to: "node_modules/@prisma"
    // },
    // {
    //     from: join(fs.realpathSync("node_modules/prisma"), "../.prisma/client/**/*"),
    //     to: "node_modules/.prisma/client"
    // },
]
// process.exit(0);
const config: Configuration = {
    appId, productName, icon,
    asar: false,

    directories: {
        output: "build",
        buildResources: "resources"
    },
    files: [
        "dist/electron/**", "dist/renderer/**", "package.json"
    ],
    extraMetadata: {
        version: process.env.VITE_APP_VERSION
    },
    extraResources,
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
