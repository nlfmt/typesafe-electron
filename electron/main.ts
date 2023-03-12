import { app } from "electron";
import "./bridge/security";
import { createWindow } from "./window";


app.whenReady().then(createWindow);