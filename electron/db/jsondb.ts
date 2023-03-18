import { v4 as uuid } from "uuid";
import z from "zod";
import fs from "node:fs/promises";


/** Convert a model type to a query type, so arrays can be queried with $contains and $is */
type ToFindQuery<T> = {
    [K in keyof T]: T[K] extends any[] ? T[K] | { $contains: T[K][number] } : T[K]
};


class ObjectId {
    id: string;
    constructor(id?: string) {
        if (id) {
            // Test if the string is a valid uuid
            if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
                this.id = id;
            } else throw new Error("Invalid ObjectId");
        } else
            this.id = uuid();
    }

    toString() { return this.id; }
}

/**
 * Create a new JsonDB client
 * @param path The path to the database file
 * @param models A map of model names to their schemas
 * @returns A DB Client that can be used to query the database
 */
function JsonDB<ModelDef extends Record<string, z.ZodSchema<any>>>(path: string, models: ModelDef) {

    type MODEL_NAME = keyof ModelDef;
    type MODELS_T = { [K in MODEL_NAME]: z.infer<ModelDef[K]> };

    let DB: any = {};

    /** A class that handles all queries for a specific model */
    class DBQueryClient<K extends MODEL_NAME> {
        private mdl: K;
        private db: DBManager;
        /** Stores a map of model names to their query clients to prevent multiple instances of the same model's query client */
        private static clients = new Map<MODEL_NAME, DBQueryClient<MODEL_NAME>>();

        constructor(db: DBManager, model: K) { this.mdl = model; this.db = db; }

        static for(db: DBManager, model: MODEL_NAME) {
            if (!DBQueryClient.clients.has(model))
                DBQueryClient.clients.set(model, new DBQueryClient(db, model));
            return DBQueryClient.clients.get(model);
        }

        /**
         * Find a document by its id
         * @param id The id of the document to find
         * @returns The document if found, null otherwise
         */
        findById(id: ObjectId): MODELS_T[K] | null {
            const { mdl } = this;
            return null;
        }

        /**
         * Find a document by a query
         * @param query The query to find the document by
         * @returns The document if found, null otherwise
         */
        find(query: Partial<ToFindQuery<MODELS_T[K]>>): MODELS_T[K] | null {
            const { mdl } = this;
            const modelSchema = models[mdl];
            
            return null;
        }

        /**
         * Find multiple documents by a query
         * @param query The query to find the documents by
         * @returns An array of documents that match the query
         */
        findMany(query: Partial<ToFindQuery<MODELS_T[K]>>): MODELS_T[K][] {
            const { mdl } = this;
            const modelSchema = models[mdl];

            return [];
        }

        /**
         * Insert a document into the database
         * @param obj The object to insert into the database
         * @returns The inserted document
         */
        insert(obj: Omit<MODELS_T[K], "_id">): MODELS_T[K] | null {
            const { mdl } = this;
            const modelSchema = models[mdl];

            // check if the object is valid
            try {
                modelSchema.parse(obj);
            } catch (err) {
                console.error(err);
                return null;
            }

            // insert the object
            const newObj = { ...obj, _id: new ObjectId() };
            DB[mdl].push(newObj);

            // save the database
            this.db.$save();

            return newObj;
        }
    }


    class DBManager  {
        private path: string;
        private models: { [K: string]: z.ZodSchema<any> };

        constructor(path: string, models: { [K: string]: z.ZodSchema<any> }) {
            this.path = path;
            this.models = models;
            this.loadFromFile();
        }

        private async loadFromFile() {
            try {
                await fs.access(path, fs.constants.R_OK | fs.constants.W_OK);
                DB = JSON.parse(await fs.readFile(path, "utf-8"));

                // Validate the data
                for (const model in models) {
                    const modelSchema = models[model];
                    const modelData = DB[model];
                    if (!modelData || !Array.isArray(modelData)) throw new Error(`Invalid data for model ${model}`);

                    // TODO: Should we typecheck here or assume it has been written correctly?
                    // if (modelData) {
                    //     for (const doc of modelData) {
                    //         modelSchema.parse(doc);
                    //     }
                    // }
                }
            } catch (e) {
                fs.writeFile(path, "{}", "utf-8");
                DB = {};
                for (const model in models) {
                    DB[model] = [];
                }
            }
        }

        async $save() {
            await fs.writeFile(path, JSON.stringify(DB), "utf-8");
        }

        async $disconnect() {
            await this.$save();
        }
    }

    const db = new DBManager(path, models);

    return new Proxy(db, {
        get(db, prop) {
            prop = String(prop);
            const model = prop as MODEL_NAME;
    
            if (prop in models) return DBQueryClient.for(db, model);
            else if (prop in db) return db[prop as keyof typeof db];
            else throw new Error(`Unknown property ${prop} in DBClient`);
        }
    }) as {
        [K in MODEL_NAME]: DBQueryClient<K>
    } & typeof db;
}

export default JsonDB;