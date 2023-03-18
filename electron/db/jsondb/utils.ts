import { v4 as uuid } from "uuid";

export class ObjectId {
    id: string;
    constructor(id?: string) {
        if (id) {
            // Test if the string is a valid uuid
            if (
                /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                    id
                )
            ) {
                this.id = id;
            } else throw new Error("Invalid ObjectId");
        } else this.id = uuid();
    }

    toString() {
        return this.id;
    }
}
