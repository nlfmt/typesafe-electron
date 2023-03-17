import z from "zod";

const user = z.object({
    isAdmin: z.boolean().default(true).describe("Is the user an admin?"),
    name: z.string().nonempty().describe("The user's name"),
    array: z.array(z.string()).default([]),
    tuple: z.tuple([z.string(), z.number()]),
});

export default { user } as const;