import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db" // your drizzle instance
import { nextCookies } from "better-auth/next-js"
import * as schema from "@/db/schema"

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: schema,
  }),
  secret: process.env.BETTER_AUTH_SECRET!, // required – generate a strong secret
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Optional overrides (usually not needed)
      // redirectURI: "http://localhost:3000/api/auth/callback/github",
      // scopes: ["user:email"], // default already includes this
    },
  },
  plugins: [nextCookies()],
})
