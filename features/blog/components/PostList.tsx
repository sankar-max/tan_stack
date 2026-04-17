"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { getPostsAction } from "../actions"
import { postKeys } from "../utils/postKey"
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
import { 
  FileText, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Trash2,
  ExternalLink,
  Loader2,
  Clock,
  ChevronRight,
  Search
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { DeletePostDialog } from "./DeletePostDialog"
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger"

interface PostListProps {
  userId: string
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
    queryFn: async ({ pageParam }) => {
      const result = await getPostsAction({
        authorId: userId,
        cursor: pageParam as number,
        limit: 10,
        published: undefined,
      })
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  const posts = data?.pages.flatMap((page) => page.posts) || []

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 w-full rounded-2xl bg-muted/20 animate-pulse border border-border/40" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <div className="p-8 text-center text-destructive bg-destructive/5 rounded-2xl font-medium border border-destructive/10">Failed to load your stories.</div>
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center rounded-3xl border border-dashed bg-muted/5">
        <div className="bg-muted p-4 rounded-full mb-4">
          <FileText className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-bold">No stories found</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-6">Start writing to see your content here.</p>
        <Link href="/dashboard/posts/new">
          <Button variant="outline" className="rounded-full">Create New Post</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Header Row (Hidden on mobile) */}
      <div className="hidden md:grid grid-cols-[1fr_120px_140px_80px] px-6 py-3 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
        <span>Story Title</span>
        <span className="text-center">Status</span>
        <span className="text-center">Date</span>
        <span className="text-right">Manage</span>
      </div>

      <div className="space-y-2">
        {posts.map((post) => (
          <div 
            key={post.id} 
            className="group relative flex flex-col md:grid md:grid-cols-[1fr_120px_140px_80px] items-center gap-4 bg-background border border-border/50 p-4 md:px-6 md:py-3 rounded-2xl hover:border-primary/30 hover:bg-muted/10 transition-all duration-200"
          >
            {/* Title & Excerpt */}
            <div className="flex flex-col min-w-0 w-full">
              <Link href={`/dashboard/posts/${post.id}/edit`} className="font-bold text-sm sm:text-base hover:text-primary transition-colors truncate">
                {post.title}
              </Link>
              <p className="text-xs text-muted-foreground/70 truncate mt-0.5 md:mt-0 font-medium">
                {post.excerpt || "No summary provided"}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center justify-center">
              <Badge 
                variant={post.published ? "default" : "secondary"}
                className={`
                  rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider border
                  ${post.published 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                    : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  }
                `}
              >
                {post.published ? "Public" : "Draft"}
              </Badge>
            </div>

            {/* Date */}
            <div className="hidden md:flex items-center justify-center text-xs font-medium text-muted-foreground/60 whitespace-nowrap">
              {format(new Date(post.createdAt), "MMM d, yyyy")}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end w-full md:w-auto">
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-accent group-hover:bg-background shadow-none border-none">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl border-border/50 p-1 min-w-[140px]">
                  <Link href={`/dashboard/posts/${post.id}/edit`}>
                    <DropdownMenuItem className="rounded-lg text-xs font-bold py-2 cursor-pointer">
                      <Edit3 className="mr-2 h-3.5 w-3.5" /> Edit
                    </DropdownMenuItem>
                  </Link>
                  <Link href={`/blog/${post.id}`} target="_blank">
                    <DropdownMenuItem className="rounded-lg text-xs font-bold py-2 cursor-pointer">
                      <Eye className="mr-2 h-3.5 w-3.5" /> View
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator className="opacity-50" />
                  <DeletePostDialog postId={post.id.toString()} postTitle={post.title}>
                    <DropdownMenuItem
                      className="rounded-lg text-xs font-bold py-2 cursor-pointer text-destructive focus:text-destructive"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                    </DropdownMenuItem>
                  </DeletePostDialog>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link href={`/dashboard/posts/${post.id}/edit`} className="md:hidden ml-auto">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                   <ChevronRight size={16} />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <InfiniteScrollTrigger
        onIntersect={() => fetchNextPage()}
        isEnabled={!!hasNextPage}
        isFetching={isFetchingNextPage}
      />
      
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground/50" />
        </div>
      )}
    </div>
  )
}
