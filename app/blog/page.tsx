import type { Metadata } from "next"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import { postKeys, postService } from "@/features/blog"
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

async function Blog() {
  const queryClient = new QueryClient()

  try {
    await queryClient.prefetchInfiniteQuery({
      queryKey: [...postKeys.publicLatest(12), ""],
      queryFn: ({ pageParam }) =>
        postService.getPosts({
          limit: 12,
          search: "",
          cursor: pageParam as unknown as number,
        }),
      initialPageParam: undefined,
      getNextPageParam: (lastPage: any) => lastPage.data.nextCursor ?? undefined,
    })
  } catch (error) {
    console.error("Failed to prefetch posts for blog home:", error)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogListView />
    </HydrationBoundary>
  )
}

export default Blog
