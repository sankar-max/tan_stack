import { postServiceServer } from "@/features/blog/server";
import { GetPostLikesSchema } from "@/features/blog/services/schema";
import { fail, ok } from "@/lib/api/response";
import { zodError } from "@/lib/api/zod-error";
import { parseSearchParams } from "@/lib/http";
import { getCurrentUser, requireUser } from "@/lib/requireAuth";

export async function GET(req: Request, { params }: RouteContext<'/api/post/[id]/comment'>) {
 await requireUser(req)
 const { id: postId } = await params
 if (!postId) {
  return fail("Post ID is required", 400, "BAD_REQUEST")
 }
 const searchParams = parseSearchParams(req, GetPostLikesSchema)
 if (!searchParams.success) {
  return zodError(searchParams.error)
 }
 const sessionUser = await getCurrentUser(req)
 const currentUserId = sessionUser?.id || ""
 const { page, limit } = searchParams.data
 try {
  const res = await postServiceServer.getPostComments({ postId: +(postId), page, limit })

  return ok(res, "Comments fetched successfully", 200)
 } catch (error) {
  return fail("Failed to fetch comments", 500, "INTERNAL_ERROR")
 }
}


export async function POST(req: Request, { params }: RouteContext<'/api/post/[id]/comment'>) {
 await requireUser(req)
 const { id: postId } = await params
 if (!postId) {
  return fail("Post ID is required", 400, "BAD_REQUEST")
 }
 const body = await req.json()
 const { content } = body
 if (!content) {
  return fail("Comment content is required", 400, "BAD_REQUEST")
 }
 const sessionUser = await getCurrentUser(req)
 const currentUserId = sessionUser?.id || ""
 try {
  const res = await postServiceServer.createPostComment({ postId: +(postId), userId: currentUserId, content })

  return ok(res, "Comment created successfully", 200)
 } catch (error) {
  return fail("Failed to create comment", 500, "INTERNAL_ERROR")
 }
}