import { requireUser } from "@/lib/requireAuth"
import { zodError } from "../lib/zod-error"
import { ok, fail } from "../lib/response"

// db
import { db } from "@/db"
import { posts } from "@/db/schema/blog.schema"
import { and, ilike, sql, desc, asc, eq } from "drizzle-orm"

// schema
import { CreatePostSchema } from "./schema"
import { SearchQuerySchema } from "@/app/api/_utilities/schema/search-schema"
import { parseSearchParams } from "@/app/api/_utilities/http/parse-search-params"

export async function GET(req: Request): Promise<ReturnType<typeof ok>> {
  const authResult = await requireUser(req)

  if (authResult.error) {
    return fail("Unauthorized", 401, "UNAUTHORIZED")
  }

  const searchParams = parseSearchParams(req, SearchQuerySchema)
  if (!searchParams.success) {
    return zodError(searchParams.error)
  }

  const { page, limit, search, sort, order } = searchParams.data
  const offset = (page - 1) * limit

  const where = and(
    search ? ilike(posts.title, `%${search}%`) : undefined,
    eq(posts.published, true) // Only show published posts for search
  )

  const orderBy = order === "asc" ? asc(posts[sort]) : desc(posts[sort])

  const [data, [{ total }]] = await Promise.all([
    db.query.posts.findMany({
      where,
      limit,
      offset,
      orderBy,
      with: {
        author: {
          columns: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    db
      .select({ total: sql<number>`count(*)` })
      .from(posts)
      .where(where),
  ])

  return ok({
    posts: data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(req: Request) {
  const authResult = await requireUser(req)

  if (authResult.error) {
    return fail("Unauthorized", 401, "UNAUTHORIZED")
  }

  try {
    const body = await req.json()
    const result = CreatePostSchema.safeParse(body)

    if (!result.success) {
      return zodError(result.error)
    }

    const { title, content, excerpt, published } = result.data
    const authorId = authResult.user.id

    // Simple slug generation
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 7)

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        content,
        excerpt,
        published,
        authorId,
        slug,
      })
      .returning()

    return ok(newPost, "Post created successfully", 201)
  } catch (error) {
    console.error("Post creation error:", error)
    return fail("Failed to create post", 500, "INTERNAL_SERVER_ERROR")
  }
}
