import { z } from "zod"

export const SearchQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    search: z.string().optional(),
    sort: z.enum(["createdAt", "updatedAt", "title"]).default("updatedAt"),
    order: z.enum(["asc", "desc"]).default("desc"),
  })
  .strict()
