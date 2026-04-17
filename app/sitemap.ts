import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/config"
import { postServiceServer } from "@/features/blog/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ]

  // Dynamic blog post routes
  let postRoutes: MetadataRoute.Sitemap = []

  try {
    const result = await postServiceServer.getPosts({
      limit: 1000,
      published: true,
    })

    postRoutes = result.posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.id}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))
  } catch (error) {
    console.error("Failed to generate sitemap for blog posts:", error)
  }

  return [...staticRoutes, ...postRoutes]
}
