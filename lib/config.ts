import { env } from "./env";

export const siteConfig = {
  name: "TanStack Auth",
  description: "A secure and scalable authentication system built with Better Auth and Drizzle.",
  url: env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  links: {
    github: "https://github.com/your-username/tanstack-auth", // Update with your actual repo
  },
} as const;

export const authConfig = {
  callbackUrl: "/dashboard",
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
} as const;

export type SiteConfig = typeof siteConfig;
export type AuthConfig = typeof authConfig;
