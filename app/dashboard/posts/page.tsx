import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import {
  dehydrate,
  QueryClient,
} from "@tanstack/react-query"
import { postKeys } from "@/features/blog/utils/postKey"
import { postService } from "@/features/blog/services"
import dynamic from "next/dynamic"

const MyPostsView = dynamic(() => import("@/features/blog/components/MyPostsView"))

export const metadata: Metadata = {
  title: "My Stories",
  description: "Manage your blog posts and stories.",
}

export default async function PostsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-sm font-bold text-muted-foreground">Session expired. Please sign in again.</h2>
      </div>
    )
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchInfiniteQuery({
    queryKey: postKeys.myPosts(session.user.id),
    queryFn: ({ pageParam }) =>
      postService.getPosts({
        authorId: session.user.id,
        cursor: pageParam as unknown as number,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage: any) => lastPage.data.nextCursor ?? undefined,
  })

  return (
    <MyPostsView 
      userId={session.user.id} 
      user={session.user}
      dehydratedState={dehydrate(queryClient)} 
    />
  )
}
