import { app } from "electron";
import StormDB from "@nlfmt/stormdb";
import path from "path";

import { postModel, userModel } from "./models";
export * from "./models";

const db = StormDB({
    user: userModel,
    post: postModel
}, {
    storage: path.join(app.getPath("userData"), "db.json")
});

export default db;
