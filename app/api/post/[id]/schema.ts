import { z } from "zod"

export const GetPostSchemaQuery = z.object({
  id: z.coerce.number(),
})

export type GetPostSchemaQuery = z.infer<typeof GetPostSchemaQuery>
