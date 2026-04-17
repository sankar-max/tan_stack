import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import { postKeys } from "@/features/blog"
import { siteConfig } from "@/lib/config"
import dynamic from "next/dynamic"

import BlogListView from "@/features/blog/components/BlogListView"

export const metadata: Metadata = {
  title: "Blog",
  description: "Explore stories, articles, and ideas from writers around the world on Blog.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | Blog",
    description: "Explore stories, articles, and ideas from writers around the world on Blog.",
    url: "/blog",
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: "Blog Blog" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Blog",
    description: "Explore stories, articles, and ideas from writers around the world on Blog.",
  },
}

export const revalidate = 60 // Revalidate every 60 seconds

import { getPostsAction } from "@/features/blog/actions"

async function Blog() {
  const queryClient = new QueryClient()
  let posts: any[] = []

  try {
    const result = await getPostsAction({
      limit: 12,
      search: "",
      published: true,
    })
    
    if (result.success) {
      posts = result.data.posts
      await queryClient.prefetchInfiniteQuery({
        queryKey: [...postKeys.publicLatest(12), ""],
        queryFn: () => Promise.resolve(result.data),
        initialPageParam: undefined as number | undefined,
      })
    }
  } catch (error) {
    console.error("Failed to prefetch posts for blog home:", error)
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": siteConfig.name,
    "description": siteConfig.description,
    "url": `${siteConfig.url}/blog`,
    "blogPost": posts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": `${siteConfig.url}/blog/${post.id}`
    }))
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogListView />
      </HydrationBoundary>
    </>
  )
}

export default Blog
