import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { expo } from "@better-auth/expo"

import { db } from "@/db"
import * as schema from "@/db/schema/auth.schema"
import { env } from "./env"

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,

  /**
   * 🚨 CRITICAL FOR EXPO + VERCEL
   * Never compute this dynamically.
   * Must be stable & HTTPS.
   */
  baseURL: "https://tan-stack-ten.vercel.app",

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  /**
   * 🚨 REQUIRED FOR MOBILE + CROSS ORIGIN
   */
  advanced: {
    defaultCookieAttributes: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
  },

  /**
   * 🚨 REQUIRED FOR EXPO REQUESTS
   * Trust schemes — NOT IPs.
   */
  trustedOrigins: [
    "https://tan-stack-ten.vercel.app",

    // Expo Dev / Tunnel Support
    "exp://",
    "https://u.expo.dev",

    // Your deep link scheme
    "blog-mobile://",
    "android-app://com.chan.blogmobile",
    "null",
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

  plugins: [nextCookies(), expo()],
})
