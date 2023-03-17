import z from "zod";

const user = z.object({
    isAdmin: z.boolean().default(true).describe("Is the user an admin?"),
    name: z.string().nonempty().describe("The user's name"),
    array: z.array(z.string()).default([]),
    tuple: z.tuple([z.string(), z.number()]),
});


const post = z.object({
    title: z.string().nonempty().describe("The post's title"),
    content: z.string().nonempty().describe("The post's content"),
    data: z.object({
        test: z.string().nonempty().describe("The post's test"),
    }),
});


export { user, post };