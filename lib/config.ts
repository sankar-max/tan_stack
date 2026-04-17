import { env } from "./env";
import { getBaseUrl } from "./utils";
const baseUrl = env.NEXT_PUBLIC_BASE_URL || getBaseUrl();

export const siteConfig = {
  name: "Blog — Stories, Ideas & Articles for Modern Readers",
  shortName: "Blog",
  description:
    "A modern blogging platform for writers and thinkers. Discover stories, share ideas, and connect with readers around the world.",
  url: baseUrl,
  ogImage: "/blog-meta-icon.png",
  keywords: [
    "blog",
    "writing",
    "stories",
    "articles",
    "publishing",
    "nextjs",
  ],
  author: {
    name: "Blog Team",
    url: baseUrl,
  },
  twitter: "@Blogapp",
  links: {
    github: "https://github.com/sankar-max",
  },
} as const;

export const authConfig = {
  callbackUrl: "/dashboard",
  signInUrl: "/sign-in",
  signUpUrl: "/sign-up",
} as const;

export type SiteConfig = typeof siteConfig;
export type AuthConfig = typeof authConfig;
