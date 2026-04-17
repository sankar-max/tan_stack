import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/sign-in",
          "/sign-up",
        ],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
