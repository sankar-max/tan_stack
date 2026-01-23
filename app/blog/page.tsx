import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import { getPublicPosts } from "./_actions"
import BlogSection from "./_components/blog-section"
import { postKeys } from "./lib/post-key"

async function Blog() {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: postKeys.publicLatest(12),
    queryFn: () => getPublicPosts(12),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogSection />
    </HydrationBoundary>
  )
}

export default Blog
