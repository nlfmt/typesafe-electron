import { PrismaClient } from "@prisma/client";
import { join } from "path";
import {} from "electron";

const url = import.meta.env.DEV
    ? join(__dirname, "../../../resources/db.sqlite")
    : join(process.resourcesPath, "resources/db.sqlite");


const prisma = new PrismaClient({
    datasources: {
        db: { url: `file:${url}` },
    },
    log: ["info", "warn"],
});

export default prisma;