import z from "zod";

const user = z.object({
    isAdmin: z.boolean().default(true).describe("Is the user an admin?"),
    name: z.string().nonempty().describe("The user's name"),
})

export default { user }