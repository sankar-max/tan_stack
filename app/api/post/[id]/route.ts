import { getCurrentUser } from "@/lib/requireAuth"
import { ok, fail } from "../../lib/response"
import { GetPostSchemaQuery } from "./schema"
import { zodError } from "../../lib/zod-error"
import { db } from "@/db"
import { comments, postLikes, posts } from "@/db/schema/blog.schema"
import { user } from "@/db/schema/auth.schema"
import { eq, sql } from "drizzle-orm"

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

  const [post] = await db
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
    .where(eq(posts.id, result.data.id))
    .limit(1)

  if (!post) {
    return fail("Post not found", 404, "NOT_FOUND")
  }

  return ok(post)
}

import { CreatePostSchema } from "../schema"
import { requireUser } from "@/lib/requireAuth"

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

  const [updatedPost] = await db
    .update(posts)
    .set({
      ...result.data,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, Number(id)))
    .returning()

  return ok(updatedPost)
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

  await db.delete(posts).where(eq(posts.id, Number(id)))

  return ok({ message: "Post deleted successfully" })
}
