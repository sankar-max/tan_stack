import { z } from "zod"

export const CreatePostSchema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10),
  excerpt: z.string().max(500).optional(),
  published: z.boolean().default(false),
})

export type CreatePostInput = z.infer<typeof CreatePostSchema>
