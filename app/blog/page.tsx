import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import { QueryClient } from "@tanstack/react-query"
import { BlogSection, postKeys, postService } from "@/features/blog"
import { headers } from "next/headers"

async function Blog() {
  const queryClient = new QueryClient()
  const reqHeaders = await headers()
  const cookie = reqHeaders.get("cookie")

  await queryClient.prefetchQuery({
    queryKey: [...postKeys.publicLatest(12), ""],
    queryFn: () =>
      postService.getPosts(
        { limit: 12 },
        { headers: { Cookie: cookie ?? "" } },
      ),
  })
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogSection />
    </HydrationBoundary>
  )
}

export default Blog
