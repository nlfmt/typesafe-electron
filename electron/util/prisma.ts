import { PrismaClient } from "@prisma/client";
import { join } from "path";
import {} from "electron";

const url = import.meta.env.DEV
    ? join(__dirname, "../../buildResources/db.sqlite")
    : join(process.resourcesPath, "buildResource/db.sqlite");


const prisma = new PrismaClient({
    datasources: {
        db: { url: `file:${url}` },
    },
    log: ["query", "info", "warn"],
});

export default prisma;