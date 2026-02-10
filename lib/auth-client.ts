import { createAuthClient } from "better-auth/react"
import { env } from "./env"
import { getBaseUrl } from "./utils"

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL || getBaseUrl(),
})
export const { signIn, signUp, signOut, useSession } = authClient
