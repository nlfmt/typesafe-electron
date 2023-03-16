import { app } from "electron";
import { join } from "node:path";
import fs from "fs";

const DB_PATH = join(app.getPath("userData"), "db.json");
const db = JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
