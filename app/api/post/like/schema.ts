import { z } from "zod"

export const LikePostSchema = z.object({
 postId: z.coerce.number(),
})

export type LikePostSchemaT = z.infer<typeof LikePostSchema>