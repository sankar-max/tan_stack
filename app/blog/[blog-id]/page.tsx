import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { postKeys } from "../lib/post-key"
import { postService } from "@/service/post"
import PostPage from "./post-page"

export type PostParams = {
  params: Promise<{ "blog-id": string }>
}
async function Blog({ params }: PostParams) {
  const queryClient = new QueryClient()
  const { "blog-id": blogId } = await params
  await queryClient.prefetchQuery({
    queryKey: [...postKeys.bySlug(blogId)],
    queryFn: () => postService.getPost(blogId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PostPage params={params} />
    </HydrationBoundary>
  )
}

export default Blog
