import { requireUser } from "@/lib/requireAuth"
import { BookmarkPostSchema } from "@/features/blog/services/schema"
import { postServiceServer } from "@/features/blog/services/server-post-service"
import { ok, fail } from "@/lib/api/response"

export async function POST(req: Request) {
  const authResult = await requireUser(req)

  if (authResult.error) {
    return fail("Unauthorized", 401, "UNAUTHORIZED")
  }

  try {
    const body = await req.json()
    const { postId } = BookmarkPostSchema.parse(body)

    const result = await postServiceServer.toggleBookmark({
      postId,
      userId: authResult.user.id,
    })

    return ok(result, result.bookmarked ? "Added to library" : "Removed from library")
  } catch (error) {
    console.error("Bookmark error:", error)
    return fail("Internal Server Error", 500, "INTERNAL_SERVER_ERROR")
  }
}
