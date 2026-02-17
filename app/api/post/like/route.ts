import { requireUser } from "@/lib/requireAuth"
import { zodError } from "@/lib/api/zod-error"
import { ok, fail } from "@/lib/api/response"
import { revalidatePath } from "next/cache"

// schema
import { LikePostSchema } from "@/features/blog/services/schema"
import { postServiceServer } from "@/features/blog/services/server-post-service"

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

    const stats = await postServiceServer.toggleLike({ postId, userId })

    if (!stats || !stats.postExists) {
      return fail("Post not found", 404, "NOT_FOUND")
    }

    const { isLiked, totalLikes } = stats

    // Revalidate the blog list to reflect updated like counts
    revalidatePath("/blog")

    return ok(
      {
        liked: isLiked,
        totalLikes,
      },
      isLiked ? "Liked successfully" : "Unliked successfully",
      isLiked ? 201 : 200,
    )
  } catch (error) {
    console.error("[Post Like Toggle Error]:", error)
    return fail("Failed to toggle like", 500, "INTERNAL_SERVER_ERROR")
  }
}
