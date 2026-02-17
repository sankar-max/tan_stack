import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { postKeys, postService } from "@/features/blog"
import { postServiceServer } from "@/features/blog/server"
import BlogPostContent from "./BlogPostContent"

// Pattern: SSG + ISR
export const revalidate = 3600 // Revalidate every hour

export interface PostPageProps {
  params: Promise<{ "blog-id": string }>
}

export async function generateStaticParams() {
  const result = await postServiceServer.getPosts({
    limit: 100,
    page: 1,
    sort: "createdAt",
    order: "desc",
    published: true,
  })

  return result.posts.map((post) => ({
    "blog-id": post.id.toString(),
  }))
}

export default async function PostPage({ params }: PostPageProps) {
  const { "blog-id": blogId } = await params
  const queryClient = new QueryClient()

  // Prefetch data via API route handler
  await queryClient.prefetchQuery({
    queryKey: postKeys.bySlug(blogId),
    queryFn: () => postService.getPost(blogId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogPostContent params={params} />
    </HydrationBoundary>
  )
}
