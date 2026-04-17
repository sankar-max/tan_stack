"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { postService } from "../services";
import { postKeys } from "../utils/postKey";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Eye,
  Trash2,
  Loader2,
  Clock,
  User,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface BookmarkListProps {
  userId: string;
}

export function BookmarkList({ userId }: BookmarkListProps) {
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: postKeys.bookmarks(userId),
    queryFn: ({ pageParam }) =>
      postService.getBookmarkedPosts({ cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  const { mutate: toggleBookmark } = useMutation({
    mutationFn: (postId: number) => postService.toggleBookmark(postId),
    onSuccess: (data, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.bookmarks(userId) });
      queryClient.invalidateQueries({ queryKey: postKeys.all });
      if (data.bookmarked) {
        toast.success("Bookmark removed");
      } else {
        toast.info("Bookmark added");
      }
    },
    onError: () => {
      toast.error("Failed to remove bookmark");
    },
  });

  const posts = data?.pages.flatMap((page) => page.posts) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-48 w-full rounded-3xl bg-muted/20 animate-pulse border border-border/40"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12 text-center text-destructive bg-destructive/5 rounded-3xl font-bold border border-destructive/10">
        Failed to load your curated library.
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center rounded-[2.5rem] border border-dashed border-border/60 bg-muted/5">
        <div className="bg-primary/5 p-6 rounded-full mb-6 ring-1 ring-primary/10">
          <Bookmark className="h-10 w-10 text-primary/40" />
        </div>
        <h3 className="text-2xl font-black tracking-tight">
          Your library is empty
        </h3>
        <p className="text-base text-muted-foreground mt-2 mb-8 max-w-[320px] mx-auto font-medium">
          Save stories you love to read them later or keep them as inspiration.
        </p>
        <Link href="/blog">
          <Button className="rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20">
            Explore Stories
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group relative flex flex-col bg-background/50 backdrop-blur-sm border border-border/50 p-6 rounded-[2rem] hover:border-primary/30 hover:bg-muted/10 transition-all duration-500 shadow-sm hover:shadow-xl"
          >
            {/* Header: Author & Date */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 ring-1 ring-border/50">
                  <AvatarImage src={post.author?.image || undefined} />
                  <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black">
                    {post.author?.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-[11px] font-black text-foreground/80 leading-tight">
                    {post.author?.name}
                  </span>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                    <Clock size={10} />
                    {format(new Date(post.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100"
                onClick={() => toggleBookmark(post.id)}
              >
                <Trash2 size={14} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-black tracking-tight leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-sm text-muted-foreground/70 line-clamp-2 font-medium leading-relaxed">
                {post.excerpt || "A fascinating story waiting to be read..."}
              </p>
            </div>

            {/* Footer: Actions */}
            <div className="mt-6 flex items-center gap-3">
              <Link href={`/blog/${post.slug}`} className="flex-1">
                <Button className="w-full rounded-full h-10 font-bold text-xs gap-2 shadow-sm">
                  <Eye size={14} />
                  Read Story
                </Button>
              </Link>
              <Link href={`/blog/${post.slug}`} target="_blank">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10 rounded-full border-border/40"
                >
                  <ExternalLink size={14} />
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
        <div className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
        </div>
      )}
    </div>
  );
}
