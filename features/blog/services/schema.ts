import { z } from "zod"

export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  excerpt: z
    .string()
    .max(300, "Excerpt must be less than 300 characters")
    .optional(),
  published: z.boolean().default(false),
})

export type CreatePostInput = z.infer<typeof CreatePostSchema>

export const PostQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10),
  cursor: z.coerce.number().optional(),
  search: z.string().optional(),
  authorId: z.string().optional(),
  sort: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  published: z
    .string()
    .optional()
    .transform((val) => val === "true"),
})

export const GetPostLikesSchema = z.object({
  cursor: z.string().optional(), // Using ISO date string for createdAt cursor
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export type PostQueryInput = z.infer<typeof PostQuerySchema>

export const GetPostSchemaQuery = z.object({
  id: z.coerce.number().int().positive(),
})

export const LikePostSchema = z.object({
  postId: z.coerce.number().int().positive(),
})

export type LikePostInput = z.infer<typeof LikePostSchema>

export const GetPostCommentsSchema = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export type GetPostCommentsQueryInput = z.infer<typeof GetPostCommentsSchema>
