import { app } from "electron";
import StormDB from "@nlfmt/stormdb";
import path from "path";

import models from "./models";
export * from "./models";

const db = StormDB(models, {
    storage: path.join(app.getPath("userData"), "db.json")
});

export default db;
