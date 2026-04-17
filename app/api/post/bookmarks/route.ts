import { requireUser } from "@/lib/requireAuth"
import { PostQuerySchema } from "@/features/blog/services/schema"
import { postServiceServer } from "@/features/blog/services/server-post-service"
import { ok, fail } from "@/lib/api/response"

export async function GET(req: Request) {
  const authResult = await requireUser(req)

  if (authResult.error) {
    return fail("Unauthorized", 401, "UNAUTHORIZED")
  }

  try {
    const { searchParams } = new URL(req.url)
    const query = PostQuerySchema.parse(Object.fromEntries(searchParams))

    const result = await postServiceServer.getBookmarkedPosts({
      userId: authResult.user.id,
      cursor: query.cursor,
      limit: query.limit,
    })

    return ok(result)
  } catch (error) {
    console.error("Fetch bookmarks error:", error)
    return fail("Internal Server Error", 500, "INTERNAL_SERVER_ERROR")
  }
}
