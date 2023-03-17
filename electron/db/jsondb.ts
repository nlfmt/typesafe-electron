import { v4 as uuid } from "uuid";
import z from "zod";
import fs from "fs";


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


    /** A class that handles all queries for a specific model */
    class DBQueryClient<K extends MODEL_NAME> {
        private mdl: K;
        /** Stores a map of model names to their query clients to prevent multiple instances of the same model's query client */
        private static clients = new Map<MODEL_NAME, DBQueryClient<MODEL_NAME>>();

        constructor(model: K) { this.mdl = model }

        static for(model: MODEL_NAME) {
            if (!DBQueryClient.clients.has(model))
                DBQueryClient.clients.set(model, new DBQueryClient(model));
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

            return null;
        }
    }


    class DBManager  {
        private data: any;
        private path: string;
        private models: { [K: string]: z.ZodSchema<any> };

        constructor(path: string, models: { [K: string]: z.ZodSchema<any> }) {
            this.path = path;
            this.data = JSON.parse(fs.readFileSync(path, "utf-8"));
            this.models = models;
        }

        $save() {

        }
    }

    const db = new DBManager(path, models);

    return new Proxy(db, {
        get(db, prop) {
            prop = String(prop);
            const model = prop as MODEL_NAME;
    
            if (prop in models) return DBQueryClient.for(model);
            else if (prop in db) return db[prop as keyof typeof db];
            else throw new Error(`Unknown property ${prop} in DBClient`);
        }
    }) as {
        [K in MODEL_NAME]: DBQueryClient<K>
    } & typeof db;
}

export default JsonDB;