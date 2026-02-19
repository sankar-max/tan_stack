import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import { BlogSection, postKeys, postService } from "@/features/blog"

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 60 // Revalidate every 60 seconds

async function Blog() {
  const queryClient = new QueryClient()

  // Fetch data via API Route handler - Anonymous prefetch for ISR
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
    })
  } catch (error) {
    console.error("Failed to prefetch posts for blog home:", error)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogSection />
    </HydrationBoundary>
  )
}

export default Blog
