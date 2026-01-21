import { createAuthClient } from "better-auth/react"
import { siteConfig } from "./config"

export const authClient = createAuthClient({
  baseURL: siteConfig.url,
})
export const { signIn, signUp, signOut, useSession } = authClient
