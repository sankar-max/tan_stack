import { NextRequest, NextResponse } from "next/server"
import { getSessionCookie } from "better-auth/cookies"
import { authConfig } from "./lib/config"

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request)
  const pathname = request.nextUrl.pathname

  const isDashboardPage = pathname.startsWith(authConfig.callbackUrl)

  if (!sessionCookie) {
    if (isDashboardPage) {
      const url = new URL(authConfig.signInUrl, request.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"],
}
