import z from "zod";

export const userModel = z.object({
    isAdmin: z.boolean().default(true).describe("Is the user an admin?"),
    name: z.string().nonempty().describe("The user's name"),
    array: z.array(z.string()).default([]),
    tuple: z.tuple([z.string(), z.number()])
});
export type User = z.infer<typeof userModel>;

export const postModel = z.object({
    title: z.string().nonempty().describe("The post's title"),
    content: z.string().nonempty().describe("The post's content"),
    data: z.object({
        test: z.string().nonempty().describe("The post's test")
    })
});
export type Post = z.infer<typeof postModel>;
