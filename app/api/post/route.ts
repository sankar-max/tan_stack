import { requireUser, getCurrentUser } from "@/lib/requireAuth"
import { zodError } from "../lib/zod-error"
import { ok, fail } from "../lib/response"

// db
import { db } from "@/db"
import { comments, postLikes, posts } from "@/db/schema/blog.schema"
import { user } from "@/db/schema/auth.schema"
import { and, ilike, sql, desc, asc, eq } from "drizzle-orm"

// schema
import { CreatePostSchema, PostQuerySchema } from "./schema"
import { parseSearchParams } from "@/app/api/_utilities/http/parse-search-params"

export async function GET(req: Request) {
  const searchParams = parseSearchParams(req, PostQuerySchema)
  if (!searchParams.success) {
    return zodError(searchParams.error)
  }

  const { page, limit, search, sort, order, authorId, published } =
    searchParams.data
  const offset = (page - 1) * limit

  const where = and(
    search ? ilike(posts.title, `%${search}%`) : undefined,
    authorId ? eq(posts.authorId, authorId) : undefined,
    published === true ? eq(posts.published, true) : undefined, // Allow fetching drafts if not explicitly filtering for published
    // Note: If no published filter is provided, we might want to default to published=true for public feed,
    // but for dashboard listing (authorId present), we want all.
    // Let's refine:
    // If authorId is provided (Dashboard), show all (drafts + published) unless filtered.
    // If no authorId (Public Feed), force published=true.
    !authorId ? eq(posts.published, true) : undefined,
  )

  const orderBy = order === "asc" ? asc(posts[sort]) : desc(posts[sort])

  // Parallel execution of Auth check and Main Query
  // Note: We move the "isLiked" logic inside the main SQL projection for 1-trip performance.
  const sessionUser = await getCurrentUser(req)
  const userId = sessionUser?.id || null

  const [data, totalResult] = await Promise.all([
    db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        totalLikes:
          sql<number>`(select count(*) from ${postLikes} where ${postLikes.postId} = ${posts.id})`.mapWith(
            Number,
          ),
        totalComments:
          sql<number>`(select count(*) from ${comments} where ${comments.postId} = ${posts.id})`.mapWith(
            Number,
          ),
        isLiked: userId
          ? sql<boolean>`EXISTS (select 1 from ${postLikes} where ${postLikes.postId} = ${posts.id} and ${postLikes.userId} = ${userId})`
          : sql<boolean>`false`,
      })
      .from(posts)
      .leftJoin(user, eq(posts.authorId, user.id))
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(orderBy),
    db
      .select({ total: sql<number>`count(*)` })
      .from(posts)
      .where(where),
  ])

  const total = totalResult[0]?.total || 0

  return ok({
    posts: data,
    total: Number(total),
    page,
    limit,
    totalPages: Math.ceil(Number(total) / limit),
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
