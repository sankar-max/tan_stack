import { requireUser, getCurrentUser } from "@/lib/requireAuth"
import { zodError } from "@/lib/api/zod-error"
import { ok, fail } from "@/lib/api/response"

import { postServiceServer } from "@/features/blog"

// schema
import {
  CreatePostSchema,
  PostQuerySchema,
} from "@/features/blog/services/schema"
import { parseSearchParams } from "@/lib/http"

export async function GET(req: Request) {
  const searchParams = parseSearchParams(req, PostQuerySchema)
  if (!searchParams.success) {
    return zodError(searchParams.error)
  }

  const { page, limit, search, sort, order, authorId, published } =
    searchParams.data

  const sessionUser = await getCurrentUser(req)
  const currentUserId = sessionUser?.id || null

  try {
    const result = await postServiceServer.getPosts({
      page,
      limit,
      search,
      sort,
      order,
      authorId,
      published,
      currentUserId,
    })

    return ok({
      posts: result.posts,
      total: result.total,
      page,
      limit,
      totalPages: result.totalPages,
    })
  } catch (error) {
    console.error("[Get Posts Error]:", error)
    return fail("Failed to fetch posts", 500, "INTERNAL_SERVER_ERROR")
  }
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

    const newPost = await postServiceServer.createPost({
      title,
      content,
      excerpt,
      published,
      authorId,
    })

    return ok(newPost, "Post created successfully", 201)
  } catch (error) {
    console.error("Post creation error:", error)
    return fail("Failed to create post", 500, "INTERNAL_SERVER_ERROR")
  }
}
