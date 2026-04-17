"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { postService } from "../services"
import { postKeys } from "../utils/postKey"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { DeletePostDialog } from "./DeletePostDialog"
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger"

interface PostListProps {
  userId: string
  initialData?: unknown // Optional if we pass initial data
}

export function PostList({ userId }: PostListProps) {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: postKeys.myPosts(userId),
    queryFn: ({ pageParam }) =>
      postService.getPosts({ authorId: userId, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
  })

  const posts = data?.pages.flatMap((page) => page.data.posts) || []

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted/20" />
            <CardContent className="h-20" />
            <CardFooter className="h-10" />
          </Card>
        ))}
      </div>
    )
  }

  if (isError) {
    return <div className="text-destructive">Failed to load posts.</div>
  }

  if (posts.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed">
        <div className="bg-muted/50 p-4 rounded-full mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No stories yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          You haven&apos;t written any stories yet. Share your thoughts with the
          world.
        </p>
        <Link href="/dashboard/posts/new">
          <Button>Start Writing</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id} className="group overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <CardTitle className="line-clamp-1 group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 min-h-[2.5em]">
                  {post.excerpt || "No excerpt"}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="-mr-2">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <Link href={`/dashboard/posts/${post.id}/edit`}>
                    <DropdownMenuItem>Edit Story</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DeletePostDialog
                    postId={post.id.toString()}
                    postTitle={post.title}
                  >
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DeletePostDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              Published:{" "}
              {post.published ? (
                <Badge variant="default" className="ml-2">
                  Yes
                </Badge>
              ) : (
                <Badge variant="secondary" className="ml-2">
                  Draft
                </Badge>
              )}
            </div>
          </CardContent>
          <CardFooter className="border-t bg-muted/40 px-6 py-3">
            <div className="text-xs text-muted-foreground w-full flex justify-between">
              <span>{format(new Date(post.createdAt), "MMM d, yyyy")}</span>
              <Link href={`/blog/${post.id}`} className="hover:underline">
                View Live
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
      <InfiniteScrollTrigger
        onIntersect={() => fetchNextPage()}
        isEnabled={!!hasNextPage}
        isFetching={isFetchingNextPage}
      />
    </div>
  )
}
