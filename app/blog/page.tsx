import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import BlogSection from "./_components/blog-section"
import { postKeys } from "./lib/post-key"
import { postService } from "@/service/post"

async function Blog() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: postKeys.publicLatest(12),
    queryFn: () => postService.getPosts({ limit: 12 }),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogSection />
    </HydrationBoundary>
  )
}

export default Blog
