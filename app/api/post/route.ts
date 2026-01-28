import { requireUser, getCurrentUser } from "@/lib/requireAuth"
import { zodError } from "../lib/zod-error"
import { ok, fail } from "../lib/response"

// db
import { db } from "@/db"
import { comments, postLikes, posts } from "@/db/schema/blog.schema"
import { user } from "@/db/schema/auth.schema"
import { and, ilike, sql, desc, asc, eq } from "drizzle-orm"

// schema
import { CreatePostSchema } from "./schema"
import { SearchQuerySchema } from "@/app/api/_utilities/schema/search-schema"
import { parseSearchParams } from "@/app/api/_utilities/http/parse-search-params"

export async function GET(req: Request) {
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

  // Parallel execution of Auth, Posts (content/author), and Total Count
  // This starts the DB thinking immediately, even if Auth is hit by a cold start.
  const [sessionUser, data, totalResult] = await Promise.all([
    getCurrentUser(req),
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
        totalLikes: sql<number>`(select count(*) from ${postLikes} where ${postLikes.postId} = ${posts.id})`.mapWith(Number),
        totalComments: sql<number>`(select count(*) from ${comments} where ${comments.postId} = ${posts.id})`.mapWith(Number),
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
  const postIds = data.map((p) => p.id)

  // Step 2: Supplement with user-specific "isLiked" status if logged in
  let likedSet = new Set<number>()
  if (sessionUser && postIds.length > 0) {
    const userLikes = await db
      .select({ postId: postLikes.postId })
      .from(postLikes)
      .where(and(eq(postLikes.userId, sessionUser.id), sql`${postLikes.postId} IN ${postIds}`))

    likedSet = new Set(userLikes.map((ul) => ul.postId))
  }

  const postsWithMetadata = data.map((post) => ({
    ...post,
    isLiked: likedSet.has(post.id),
  }))

  return ok({
    posts: postsWithMetadata,
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
