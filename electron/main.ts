import { app } from "electron";
import "./bridge/security";
import { createWindow } from "./window";

import db, { Test } from "./db";

app.whenReady().then(createWindow);

db.$ready.then(() => {
    db.test.create({
        name: "test",
        array: [new Test("test", 1), new Test("test2", 2)],
        nested: {
            test: new Test("test3", 3)
        },
        test: new Test("test4", 4)
    });
    console.log(db.test.findMany({}).forEach(t => {
        console.log(t);
        t.test.test();
        t.array.forEach(t => t.test());
        t.nested.test.test();
    }));
});