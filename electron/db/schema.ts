// type _DB_TYPES = {
//     string: string,
//     number: number,
//     boolean: boolean,
//     object: object,
//     array: any[],
//     date: Date,
// }
// // export type DB_TYPE = string | number | boolean | object | any[] | Date;
// export type DB_TYPE = keyof _DB_TYPES;

// // export type ModelField<T> = {
// //     default?: T,
// //     required?: boolean,
// //     unique?: boolean,
// //     validate?: (value: T) => boolean,
// // }

// type FieldOpts<T extends DB_TYPE> = {
//     type: T,
//     default?: _DB_TYPES[T],
//     required?: boolean,
//     unique?: boolean,
//     validate?: (value: _DB_TYPES[T]) => boolean,
// }

// function Field<T extends DB_TYPE>(opts: FieldOpts<T>) {
//     return opts;
// }

// export type Model = {
//     [key: string]: FieldOpts<DB_TYPE>,
// }

// export const MODELS: { [key: string]: Model } = {
//     user: {
//         test: Field({ type: "boolean", default: true }),
//     }
// } 


// type _DB_TYPES = {
//     string: string,
//     number: number,
//     boolean: boolean,
//     object: object,
//     array: any[],
//     date: Date,
// }
// // export type DB_TYPE = string | number | boolean | object | any[] | Date;
// export type DB_TYPE = keyof _DB_TYPES;

// type Field<T extends DB_TYPE> = {
//     type: T,
//     default?: _DB_TYPES[T],
//     required?: boolean,
//     unique?: boolean,
//     validate?: (value: _DB_TYPES[T]) => boolean,
// }
// type FieldOpts<T extends DB_TYPE> = Omit<Field<T>, "type">;

// const db = {
//     number: (opts: FieldOpts<"number">) => opts,
//     string: (opts: FieldOpts<"string">) => opts,
//     boolean: (opts: FieldOpts<"boolean">) => opts,
//     object: (opts: FieldOpts<"object">) => opts,
//     array: (opts: FieldOpts<"array">) => opts,
//     date: (opts: FieldOpts<"date">) => opts,
// }

// export const MODELS = {
//     user: {
//         isAdmin: db.boolean({ default: true }),
//         name: db.string({ required: true }),
//         age: db.number({ required: true }),
//         friends: db.array({ default: [] }),
//     }
// }


// export type DB_TYPE = string | number | boolean | object | any[] | Date;
// export type DB_TYPE = string | number | boolean | object | any[] | Date;

import z from "zod";
import { v4 as uuid } from "uuid";

// const MODELS = {
//     user: {
//         isAdmin: z.boolean().default(true).describe("Is the user an admin?"),
//         name: z.string().nonempty().describe("The user's name"),
//     }
// }
// const MODELS = {
//     user: z.object({
//         isAdmin: z.boolean().default(true).describe("Is the user an admin?"),
//         name: z.string().nonempty().describe("The user's name"),
//     })
// }
import MODELS from "./models";

class ObjectId {
    id: string;
    constructor(id?: string) {
        if (id) {
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
                this.id = id;
            } else throw new Error("Invalid ObjectId");
        } else {
            this.id = uuid();
        }
    }

    toString() {
        return this.id;
    }

}


type MODEL_NAMES = keyof typeof MODELS;
type MODELS_T = {
    [K in MODEL_NAMES]: z.infer<typeof MODELS[K]> & { _id: ObjectId }
};
type DBType = {
    [K in MODEL_NAMES]: {
        findById: (id: ObjectId) => MODELS_T[K] | null,
        find: (query: Partial<FindQuery<MODELS_T[K]>>) => MODELS_T[K] | null,
        findMany: (query: Partial<FindQuery<MODELS_T[K]>>) => MODELS_T[K][],
        insert: (obj: Omit<MODELS_T[K], "_id">) => MODELS_T[K] | null,
    }
}

type FindQuery<T> = {
    [K in keyof T]: T[K] extends any[] ? T[K] | { $contains: T[K][number] } | { $is: T[K][number] } : T[K]
}

const db = new Proxy({}, {
    get(_, prop) {
        return {
            find: find.bind({ model: prop as keyof typeof MODELS }),
            insert: insert.bind({ model: prop as keyof typeof MODELS }),
        }
    }
}) as DBType;

const usr = db.user.find({ isAdmin: true, tuple: { $contains: "test" } })
db.user.insert({ isAdmin: true, name: "test", array: ["test"], tuple: ["test", 1] })

function find(this: { model: MODEL_NAMES }, query: object): object | null {
    const { model } = this;
    const modelSchema = MODELS[model];
    const user = modelSchema.parse(query);

    return null;
}

function insert(this: { model: MODEL_NAMES }, obj: object): object | null {
    const { model } = this;
    const modelSchema = MODELS[model];
    const user = modelSchema.parse(obj);

    return null;
}