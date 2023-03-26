import z from "zod";

const userModel = z.object({
    isAdmin: z.boolean().default(true).describe("Is the user an admin?"),
    name: z.string().nonempty().describe("The user's name"),
});
export type User = z.infer<typeof userModel>;

const postModel = z.object({
    title: z.string().nonempty().describe("The post's title"),
    content: z.string().nonempty().describe("The post's content"),
    data: z.object({
        test: z.string().nonempty()
    })
});
export type Post = z.infer<typeof postModel>;

export default {
    user: userModel,
    post: postModel
}