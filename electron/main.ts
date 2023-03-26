import { app } from "electron";
import "./bridge/security";
import { createWindow } from "./window";

import db, { User } from "./db";
import { $neq } from "@nlfmt/stormdb";

app.whenReady().then(createWindow);

db.$ready.then(() => {
    const usr = db.user.create({ name: "John Doe" });
    const allusers = db.user.findMany();

    console.log("All Users", allusers);

    if (allusers.length > 3) {
        db.user.delete({ _id: $neq(usr._id) });
    }
});