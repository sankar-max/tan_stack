import { getUser } from "@/features/dashboard/user/server-user-service"
import { fail, ok } from "@/lib/api/response"
import { parseSearchParams } from "@/lib/http"
import { getCurrentUser } from "@/lib/requireAuth"
import { UserQuerySchema } from "@/features/dashboard/user/schema"
import { zodError } from "@/lib/api/zod-error"

export async function GET(req: Request) {
  const searchParams = parseSearchParams(req, UserQuerySchema)
  if (!searchParams.success) {
    return zodError(searchParams.error)
  }
  const sessionUser = await getCurrentUser(req)
  if (sessionUser?.id) {
    const { userId } = searchParams.data
    const user = await getUser({ userId })
    return ok(user, "User fetched successfully", 200)
  }
  return fail("User is not found", 404, "NOT_FOUND")
}

import { updateUser } from "@/features/dashboard/user/server-user-service"
import { UserUpdateSchema } from "@/features/dashboard/user/schema"

export async function PUT(req: Request) {
  const sessionUser = await getCurrentUser(req)

  if (!sessionUser?.id) {
    return fail("Unauthorized", 401, "UNAUTHORIZED")
  }

  const body = await req.json()
  const validatedData = UserUpdateSchema.safeParse(body)

  if (!validatedData.success) {
    return zodError(validatedData.error)
  }

  try {
    const updatedUser = await updateUser({
      userId: sessionUser.id,
      data: validatedData.data,
    })
    return ok(updatedUser, "User updated successfully", 200)
  } catch (error) {
    console.log("error", error)
    return fail("Failed to update user", 500, "INTERNAL_SERVER_ERROR")
  }
}
