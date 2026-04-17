import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import {
  dehydrate,
  QueryClient,
} from "@tanstack/react-query"
import { postKeys } from "@/features/blog/utils/postKey"
import dynamic from "next/dynamic"

const MyPostsView = dynamic(() => import("@/features/blog/components/MyPostsView"))

export const metadata: Metadata = {
  title: "My Stories",
  description: "Manage your blog posts and stories.",
}

import { getPostsAction } from "@/features/blog/actions"

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
    queryFn: async ({ pageParam }) => {
      const result = await getPostsAction({
        authorId: session.user.id,
        cursor: pageParam as number,
        limit: 10,
      })
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    initialPageParam: undefined as number | undefined,
  })

  return (
    <MyPostsView 
      userId={session.user.id} 
      user={session.user}
      dehydratedState={dehydrate(queryClient)} 
    />
  )
}
