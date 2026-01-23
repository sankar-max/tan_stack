import { auth } from "@/lib/auth" // your Better Auth instance
import { NextResponse } from "next/server"

export async function requireUser(req: Request) {
  const session = await auth.api.getSession({
    headers: req.headers,
  })

  if (!session?.user) {
    return {
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    }
  }

  return { user: session.user }
}
