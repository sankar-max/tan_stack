import { getCurrentUser, requireUser } from "@/lib/requireAuth"
import { ok, fail } from "@/lib/api/response"
import {
  GetPostSchemaQuery,
  CreatePostSchema,
} from "@/features/blog/services/schema"
import { zodError } from "@/lib/api/zod-error"
import { postServiceServer } from "@/features/blog"
import { db } from "@/db"
import { posts } from "@/db/schema/blog.schema"
import { eq } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const result = GetPostSchemaQuery.safeParse({ id })
  if (!result.success) {
    return zodError(result.error)
  }

  const sessionUser = await getCurrentUser(req)
  const userId = sessionUser?.id || null

  try {
    const post = await postServiceServer.getPost({
      postId: Number(result.data.id),
      userId,
    })

    if (!post) {
      return fail("Post not found", 404, "NOT_FOUND")
    }

    return ok(post)
  } catch (error) {
    console.error("[Get Post Error]:", error)
    return fail("Failed to fetch post", 500, "INTERNAL_SERVER_ERROR")
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const authResult = await requireUser(req)

  if (authResult.error) {
    return fail("Unauthorized", 401, "UNAUTHORIZED")
  }

  const body = await req.json()
  const result = CreatePostSchema.partial().safeParse(body)

  if (!result.success) {
    return zodError(result.error)
  }

  // Check ownership
  // NOTE: For now we keep this simple DB check here as it's an AuthZ check.
  // Ideally this could be in a 'checkPostOwnership' service method if reused.
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .limit(1)

  if (!existingPost) {
    return fail("Post not found", 404, "NOT_FOUND")
  }

  if (existingPost.authorId !== authResult.user.id) {
    return fail("Forbidden", 403, "FORBIDDEN")
  }

  try {
    const updatedPost = await postServiceServer.updatePost(id, result.data)
    return ok(updatedPost)
  } catch (error) {
    console.error("[Update Post Error]:", error)
    return fail("Failed to update post", 500, "INTERNAL_SERVER_ERROR")
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const authResult = await requireUser(req)

  if (authResult.error) {
    return fail("Unauthorized", 401, "UNAUTHORIZED")
  }

  // Check ownership
  const [existingPost] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .limit(1)

  if (!existingPost) {
    return fail("Post not found", 404, "NOT_FOUND")
  }

  if (existingPost.authorId !== authResult.user.id) {
    return fail("Forbidden", 403, "FORBIDDEN")
  }

  try {
    await postServiceServer.deletePost(id)
    return ok({ message: "Post deleted successfully" })
  } catch (error) {
    console.error("[Delete Post Error]:", error)
    return fail("Failed to delete post", 500, "INTERNAL_SERVER_ERROR")
  }
}
