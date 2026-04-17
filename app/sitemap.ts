import { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/config'
import { postServiceServer } from '@/features/blog/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ['', '/blog', '/blog/search'].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    const { posts } = await postServiceServer.getPosts({ limit: 1000, published: true })
    const postRoutes = posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.id}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    return [...routes, ...postRoutes]
  } catch (error) {
    console.error('Failed to generate sitemap:', error)
    return routes
  }
}
