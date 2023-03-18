import z from "zod";
import type DBManager from "./DBManager";
import { ObjectId } from "./utils";

/** Convert a model type to a query type, so arrays can be queried with $contains and $is */
type ToFindQuery<T> = {
    [K in keyof T]: T[K] extends any[]
        ? T[K] | { $contains: T[K][number] }
        : T[K];
};

/** Turn ZodSchema ModelDef to actual types using z.infer */
type InferModelDef<ModelDef extends Record<string, z.ZodSchema<any>>> = {
    [K in keyof ModelDef]: z.infer<ModelDef[K]>;
};

/** A class that handles all queries for a specific model */
export default class DBQueryClient<
    MDef extends Record<string, z.ZodSchema<any>>,
    Model extends keyof MDef
> {
    /** The name of the model this query client is for */
    private mdl: Model;
    /** The database manager */
    private db: DBManager<MDef>;

    /**
     * Create a new query client
     * @param db The database manager
     * @param model The name of the model this query client is for
     */
    constructor(db: DBManager<MDef>, model: Model) {
        this.mdl = model;
        this.db = db;
    }

    /**
     * Find a document by its id
     * @param id The id of the document to find
     * @returns The document if found, null otherwise
     */
    findById(id: ObjectId): InferModelDef<MDef>[Model] | null {
        const { mdl } = this;
        return null;
    }

    /**
     * Find a document by a query
     * @param query The query to find the document by
     * @returns The document if found, null otherwise
     */
    find(
        query: Partial<ToFindQuery<InferModelDef<MDef>[Model]>>
    ): InferModelDef<MDef>[Model] | null {
        const { mdl } = this;
        const modelSchema = this.db.models[mdl];

        return null;
    }

    /**
     * Find multiple documents by a query
     * @param query The query to find the documents by
     * @returns An array of documents that match the query
     */
    findMany(
        query: Partial<ToFindQuery<InferModelDef<MDef>[Model]>>
    ): InferModelDef<MDef>[Model][] {
        const { mdl } = this;
        const modelSchema = this.db.models[mdl];

        return [];
    }

    /**
     * Create a new document and insert it into the database
     * @param obj The object to insert into the database
     * @returns The inserted document or null if the object is invalid
     */
    create(
        obj: Omit<InferModelDef<MDef>[Model], "_id">
    ): InferModelDef<MDef>[Model] | null {
        const { mdl } = this;
        const modelSchema = this.db.models[mdl];

        // check if the object is valid
        try {
            modelSchema.parse(obj);
        } catch (err) {
            console.error(err);
            return null;
        }

        // insert the object
        const newObj = { ...obj, _id: new ObjectId() };
        this.db.data[mdl].push(newObj);

        // save the database
        this.db.$save();

        return newObj;
    }
}
