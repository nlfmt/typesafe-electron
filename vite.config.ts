import { defineConfig } from "vite";
import { rmSync } from "node:fs";
import path from "node:path";

import { loadViteEnv } from "vite-electron-plugin/plugin";
import electron from "vite-electron-plugin";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";


export default defineConfig(({ command }) => {
    rmSync("build/electron", { recursive: true, force: true });

    const sourcemap = command === "serve" ? "inline" : false;

    return {
        resolve: {
            alias: {
                "@": path.join(__dirname, "src")
            }
        },
        plugins: [
            react(),
            svgr({
                exportAsDefault: true,
                esbuildOptions: {
                    sourcemap,
                    loader: "tsx"
                },
                svgrOptions: {
                    typescript: true,
                }
            }),
            electron({
                include: ["electron"],
                transformOptions: { sourcemap },
                outDir: "build/electron",
                plugins: [ loadViteEnv() ],
            })
        ],
        build: {
            sourcemap,
            outDir: "build/renderer",
            rollupOptions: {
                input: {
                    app: "index.html",
                },
            },
        },
        clearScreen: false,
    };
});
