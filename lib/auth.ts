import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@/db" // your drizzle instance
import { nextCookies } from "better-auth/next-js"
import * as schema from "@/db/schema/auth.schema"
import { env } from "./env"
import { getBaseUrl } from "./utils"
import { expo } from "@better-auth/expo"
export const auth = betterAuth({
  account: {
    skipStateCookieCheck: true,
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: schema,
  }),
  // advanced: {
  //   defaultCookieAttributes: {
  //     httpOnly: true,
  //     secure: false,
  //     sameSite: "lax",
  //   },
  // },
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL || getBaseUrl(),
  trustedOrigins: [
    "https://tan-stack-ten.vercel.app",
    "https://tan-stack-liart.vercel.app",
    "https://tan-stack-90pvqbs3u-sankar-maxs-projects.vercel.app",
    "https://tan-stack-a66poigzx-sankar-maxs-projects.vercel.app",
    "blog-mobile://",
    // ...(process.env.NODE_ENV === "development"
    //   ? [
    //       "exp://", // Trust all Expo URLs (prefix matching)
    //       "exp://**", // Trust all Expo URLs (wildcard matching)
    //       "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
    //     ]
    //   : []),
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
  // advanced: {
  //   defaultCookieAttributes: {
  //     sameSite: "lax",
  //     secure: false, // for localhost development
  //   },
  // },
  plugins: [nextCookies(), expo()],
})
