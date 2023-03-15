import { app } from "electron";
import "./bridge/security";
import { createWindow } from "./window";

import prisma from "./util/prisma";
import logger from "./util/logger";



(async () => {
    try {
        // Create a new example entry with prisma
        const data = await prisma.example.create({ data: {
            name: "test",
            email: "test@test.de"
        }});
        logger.info(`Created new entry with id ${data.id}`);
        logger.data(data);

        // Get all example entries with prisma
        const entries = await prisma.example.findMany();
        logger.info(`Found ${entries.length} entries in the database`);
        logger.data(entries);
    } catch (error) {
        logger.error("DB Error", String(error));
    }

})();


app.whenReady().then(createWindow);