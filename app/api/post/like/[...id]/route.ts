import { NextRequest } from "next/server"
import { ok, fail } from "@/lib/api/response"
import { parseSearchParams } from "@/lib/http"
import { GetPostLikesQuerySchema } from "@/features/blog/services/schema"
import { zodError } from "@/lib/api/zod-error"
import { postServiceServer } from "@/features/blog/services/server-post-service"

type PostLikeParams = {
  params: Promise<{
    id: string[]
  }>
}

export async function GET(req: NextRequest, { params }: PostLikeParams) {
  try {
    const { id } = await params
    const postId = parseInt(id[0])

    if (isNaN(postId)) {
      return fail("Invalid post ID", 400)
    }

    const searchParams = parseSearchParams(req, GetPostLikesQuerySchema)
    if (!searchParams.success) {
      return zodError(searchParams.error)
    }

    const { page, limit } = searchParams.data

    const result = await postServiceServer.getPostLikes({
      postId,
      page,
      limit,
    })

    return ok({
      total: result.total,
      users: result.users,
      pagination: {
        page,
        limit,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error("Error fetching post likes:", error)
    return fail("Failed to fetch likes", 500)
  }
}
