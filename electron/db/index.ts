import { app } from "electron";
import JsonDB from "./jsondb";
import path from "path";

import { post, user } from "./models";

const db = JsonDB("./db.json" /*path.join(app.getPath("userData"), "db.json")*/, {
    user,
    post
});

export default db;
