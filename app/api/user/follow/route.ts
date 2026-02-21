import { UserQuerySchema } from "@/features/dashboard/user/schema"
import { followUser } from "@/features/follows/server-follows-service"
import { fail } from "@/lib/api/response"
import { getCurrentUser } from "@/lib/requireAuth"

export async function POST(req: Request) {
  const sessionUser = await getCurrentUser(req)

  const body = await req.json()
  const validatedData = UserQuerySchema.safeParse(body)

  if (!sessionUser?.id) {
    return fail("UnAuthorized user", 401)
  }

  if (!validatedData.success) {
    return fail(validatedData.error.message, 400)
  }

  const res = await followUser({
    followerId: sessionUser.id,
    followingId: validatedData.data.userId,
  })

  return res
}
