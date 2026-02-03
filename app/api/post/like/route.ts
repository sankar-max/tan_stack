import { requireUser } from "@/lib/requireAuth"
import { zodError } from "../../lib/zod-error"
import { ok, fail } from "../../lib/response"

// db
import { db } from "@/db"
import { postLikes, posts } from "@/db/schema/blog.schema"
import { sql } from "drizzle-orm"

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

    /**
     * Senior Developer Optimization: Single Round-Trip Toggle
     * Using a CTE to:
     * 1. Check if post exists
     * 2. Check current like status
     * 3. Perform Insert or Delete
     * 4. Return new count and status
     *
     * Note: CTE sub-statements see the same snapshot.
     * We calculate totalLikes by adjusting the initial count.
     */
    const query = sql`
      WITH 
        check_post AS (
          SELECT id FROM ${posts} WHERE ${posts.id} = ${postId}
        ),
        existing AS (
          SELECT 1 FROM ${postLikes} WHERE ${postLikes.postId} = ${postId} AND ${postLikes.userId} = ${userId}
        ),
        deleted AS (
          DELETE FROM ${postLikes} 
          WHERE ${postLikes.postId} = ${postId} AND ${postLikes.userId} = ${userId} 
          RETURNING 1
        ),
        inserted AS (
          INSERT INTO ${postLikes} (post_id, user_id)
          SELECT ${postId}, ${userId}
          WHERE EXISTS (SELECT 1 FROM check_post) 
            AND NOT EXISTS (SELECT 1 FROM existing)
          RETURNING 1
        )
      SELECT 
        EXISTS (SELECT 1 FROM check_post) as "postExists",
        EXISTS (SELECT 1 FROM inserted) as "isLiked",
        (SELECT count(*)::int FROM ${postLikes} WHERE ${postLikes.postId} = ${postId}) 
        + (SELECT count(*)::int FROM inserted) 
        - (SELECT count(*)::int FROM deleted) as "totalLikes"
    `

    const dbResult = await db.execute(query)
    const stats = dbResult.rows?.[0] as
      | {
          postExists: boolean
          isLiked: boolean
          totalLikes: number
        }
      | undefined

    if (!stats || !stats.postExists) {
      return fail("Post not found", 404, "NOT_FOUND")
    }

    const { isLiked, totalLikes } = stats

    return ok(
      {
        liked: isLiked,
        totalLikes,
      },
      isLiked ? "Liked successfully" : "Unliked successfully",
      isLiked ? 201 : 200
    )
  } catch (error) {
    console.error("[Post Like Toggle Error]:", error)
    return fail("Failed to toggle like", 500, "INTERNAL_SERVER_ERROR")
  }
}
