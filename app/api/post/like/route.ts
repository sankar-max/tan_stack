import { requireUser } from "@/lib/requireAuth"
import { zodError } from "@/lib/api/zod-error"
import { ok, fail } from "@/lib/api/response"
import { revalidatePath } from "next/cache"
import {
  GetPostLikesSchema,
  LikePostSchema,
} from "@/features/blog/services/schema"
import { postServiceServer } from "@/features/blog/services/server-post-service"
import { parseSearchParams } from "@/lib/http"

// get post likes and user list
export async function GET(req: Request) {
  const authResult = await requireUser(req)
  if (authResult.error) {
    return fail("Unauthorized", 401, "UNAUTHORIZED")
  }

  const searchParams = parseSearchParams(req, GetPostLikesSchema)
  if (!searchParams.success) {
    return zodError(searchParams.error)
  }
  // const sessionUser = await getCurrentUser(req)
  // const currentUserId = sessionUser?.id || ""

  const { limit } = searchParams.data
  try {
    const result = await postServiceServer.getPostLikes({
      postId: 2,

      limit,
    })
    return ok(result, "Post likes fetched successfully", 200)
  } catch (error) {
    console.error("[Get Post Likes Error]:", error)
    return fail("Failed to fetch post likes", 500, "INTERNAL_SERVER_ERROR")
  }
}

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
