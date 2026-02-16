import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { PostList } from "@/features/blog"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { postKeys, postService } from "@/features/blog"

export default async function PostsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return <div>Unauthorized</div>
  }

  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: postKeys.myPosts(session.user.id),
    queryFn: () => postService.getPosts({ authorId: session.user.id }),
  })

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Stories</h1>
          <p className="text-muted-foreground mt-2">
            Manage your blog posts and stories here.
          </p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Write New Story
          </Button>
        </Link>
      </div>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <PostList userId={session.user.id} />
      </HydrationBoundary>
    </div>
  )
}
