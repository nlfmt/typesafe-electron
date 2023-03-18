import DBQueryClient from "./DBQueryClient";
import DBManager from "./DBManager";
import z from "zod";


/**
 * Create a new JsonDB client
 * @param path The path to the database file
 * @param models A map of model names to their schemas
 * @returns A DB Client that can be used to query the database
 */
export default function JsonDB<
    ModelDef extends Record<string, z.ZodSchema<any>>
> (path: string, models: ModelDef) {

    const manager = new DBManager(path, models);

    return new Proxy(manager, {
        get(manager, prop) {
            prop = String(prop);
    
            // If the property is a model name, return a query client for that model
            if (prop in models) return manager.getQueryClient(prop as string);
            // If the property is a method of the manager, return that method
            else if (prop in manager) return manager[prop as keyof typeof manager];
            else throw new Error(`Unknown property ${prop} in DBClient`);
        }
    }) as {
        [K in keyof ModelDef]: DBQueryClient<ModelDef, K>
    } & Pick<typeof manager, "$disconnect" | "$save">;

}