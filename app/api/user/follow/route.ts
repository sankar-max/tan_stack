import { fail } from "@/lib/api/response"
import { getCurrentUser } from "@/lib/requireAuth"

export async function POST(req: Request) {
  const sessionUser = await getCurrentUser(req)
  if (sessionUser?.id) {
    return fail("UnAuthorized user")
  }
}
