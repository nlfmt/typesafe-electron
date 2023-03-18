import z from "zod";
import fs from "node:fs/promises";
import DBQueryClient from "./DBQueryClient";


export default class DBManager<ModelDef extends Record<string, z.ZodSchema<any>>>  {
    path: string;
    data: any = {};
    models: ModelDef;

    /** Stores a map of model names to their query clients to prevent multiple instances of the same model's query client */
    queryClients: Map<keyof ModelDef, DBQueryClient<ModelDef, keyof ModelDef>> = new Map();

    constructor(path: string, models: ModelDef) {
        this.path = path;
        this.models = models;
        this.loadFromFile();
    }

    getQueryClient(model: string) {
        if (!this.queryClients.has(model))
            this.queryClients.set(model, new DBQueryClient(this, model));
        return this.queryClients.get(model);
    }

    private async loadFromFile() {
        try {
            await fs.access(this.path, fs.constants.R_OK | fs.constants.W_OK);
            this.data = JSON.parse(await fs.readFile(this.path, "utf-8"));

            // Validate the data
            for (const model in this.models) {
                const modelSchema = this.models[model];
                const modelData = this.data[model];
                if (!modelData || !Array.isArray(modelData)) throw new Error(`Invalid data for model ${model}`);

                // TODO: Should we typecheck here or assume it has been written correctly?
                // if (modelData) {
                //     for (const doc of modelData) {
                //         modelSchema.parse(doc);
                //     }
                // }
            }
        } catch (e) {
            fs.writeFile(this.path, "{}", "utf-8");
            this.data = {};
            for (const model in this.models) {
                this.data[model] = [];
            }
        }
    }

    async $save() {
        await fs.writeFile(this.path, JSON.stringify(this.data), "utf-8");
    }

    async $disconnect() {
        await this.$save();
    }
}