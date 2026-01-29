import { requireUser } from "@/lib/requireAuth"
import { zodError } from "../../lib/zod-error"
import { ok, fail } from "../../lib/response"

// db
import { db } from "@/db"
import { postLikes, posts } from "@/db/schema/blog.schema"
import { and, eq, sql } from "drizzle-orm"

// schema
import { LikePostSchema } from "./schema"

/**
 * @description Senior Developer Pattern: Optimized Post Like Toggle
 * - Parallelizes existence and preference checks.
 * - Minimum field selection to reduce DB I/O.
 * - Atomic-like behavior using DB constraints.
 * - Returns updated count to prevent extra client-side fetches.
 */
export async function POST(req: Request) {
 const authResult = await requireUser(req)
 if (authResult.error) {
  return fail("Unauthorized", 401, "UNAUTHORIZED")
 }

 try {
  const body = await req.json()
  const result = LikePostSchema.safeParse(body)

  if (!result.success) {
   return zodError(result.error)
  }

  const { postId: rawPostId } = result.data
  const postId = Number(rawPostId)
  const userId = authResult.user.id

  // Check if post exists & current like status in parallel
  // Selecting only minimal columns to reduce overhead
  const [post, existingLike] = await Promise.all([
   db.query.posts.findFirst({
    where: eq(posts.id, postId),
    columns: { id: true },
   }),
   db.query.postLikes.findFirst({
    where: and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)),
    columns: { postId: true },
   }),
  ])

  if (!post) {
   return fail("Post not found", 404, "NOT_FOUND")
  }

  // Toggle Liked State
  if (existingLike) {
   await db
    .delete(postLikes)
    .where(and(eq(postLikes.postId, postId), eq(postLikes.userId, userId)))
  } else {
   await db.insert(postLikes).values({ postId, userId })
  }

  // Fetch updated total likes in the same trip for immediate client UI reflection
  const [countResult] = await db
   .select({ count: sql<number>`count(*)` })
   .from(postLikes)
   .where(eq(postLikes.postId, postId))

  const newLikedState = !existingLike
  const totalLikes = Number(countResult?.count || 0)

  return ok(
   {
    liked: newLikedState,
    totalLikes,
   },
   newLikedState ? "Liked successfully" : "Unliked successfully",
   newLikedState ? 201 : 200
  )
 } catch (error) {
  console.error("[Post Like Toggle Error]:", error)
  return fail("Failed to toggle like", 500, "INTERNAL_SERVER_ERROR")
 }
}