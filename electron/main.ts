import { app } from "electron";
import "./bridge/security";
import { createWindow } from "./window";

import "./db/db";

app.whenReady().then(createWindow);