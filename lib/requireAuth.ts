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

export async function getCurrentUser(req: Request) {
  const cookie = req.headers.get("cookie")
  const authHeader = req.headers.get("authorization")

  // Short-circuit: If no better-auth cookie or Authorization header, skip DB check
  if (!cookie?.includes("better-auth.session_token") && !authHeader) {
    return null
  }

  const session = await auth.api.getSession({
    headers: req.headers,
  })

  return session?.user || null
}
