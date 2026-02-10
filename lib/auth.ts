import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db" // your drizzle instance
import { nextCookies } from "better-auth/next-js"
import * as schema from "@/db/schema/auth.schema"
import { env } from "./env"
import { getBaseUrl } from "./utils"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: schema,
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL || getBaseUrl(),
  trustedOrigins: [
    "https://tan-stack-liart.vercel.app",
    "https://tan-stack-mj2e6muog-sankar-maxs-projects.vercel.app",
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      strategy: "jwt",
    },
  },
  plugins: [nextCookies()],
})
