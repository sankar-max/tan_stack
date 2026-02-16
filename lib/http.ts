import { ZodType } from "zod"

export const parseSearchParams = <T extends ZodType>(
  req: Request,
  schema: T,
) => {
  const url = new URL(req.url)
  const searchParams = url.searchParams

  const parsed = schema.safeParse(Object.fromEntries(searchParams))

  return parsed
}
