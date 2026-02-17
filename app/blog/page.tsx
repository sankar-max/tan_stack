import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import { BlogSection, postKeys, postService } from "@/features/blog"
import { headers } from "next/headers"

// Enable Incremental Static Regeneration (ISR)
export const revalidate = 60 // Revalidate every 60 seconds

async function Blog() {
  const queryClient = new QueryClient()

  // Fetch data via API Route handler - Anonymous prefetch for ISR
  await queryClient.prefetchQuery({
    queryKey: [...postKeys.publicLatest(12), ""],
    queryFn: () => postService.getPosts({ limit: 12 }),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogSection />
    </HydrationBoundary>
  )
}

export default Blog
