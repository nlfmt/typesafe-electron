import { app } from "electron";
import "./bridge/security";
import { createWindow } from "./window";

import db from "./db";

app.whenReady().then(createWindow);

db.$ready.then(() => {
    console.log("All Users", db.user.findMany());
});