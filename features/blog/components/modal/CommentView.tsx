"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  Loader2,
  LucideThumbsDown,
  LucideThumbsUp,
  Send,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { usePostComments } from "../../hooks/usePostComments";
import { createCommentAction } from "../../actions";
import { InfiniteScrollTrigger } from "../InfiniteScrollTrigger";

type Props = {
  postId: number;
};

function CommentView({ postId }: Props) {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();

  const {
    data: infiniteComments,
    isLoading: commentsLoading,
    error: commentsError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePostComments({ postId: postId! });

  const { mutate: createComment, isPending: isCreating } = useMutation({
    mutationFn: async (newComment: string) => {
      const response = await createCommentAction(postId!, newComment);
      if (!response.success) throw new Error(response.message);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      setContent("");
    },
  });

  const comments =
    infiniteComments?.pages.flatMap((page) => page.comments) || [];

  if (!postId) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createComment(content);
  };

  return (
    <div className="flex flex-col h-[55vh]">
      {/* Scrollable Comment Section */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 no-scrollbar">
        {commentsLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-3.5 w-24 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-full rounded" />
                    <Skeleton className="h-3 w-[90%] rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {comments.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-muted-foreground font-medium">
                  No perspectives yet.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <Avatar className="h-9 w-9 ring-1 ring-border shadow-sm shrink-0">
                    <AvatarImage src={comment.author.image || undefined} />
                    <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black">
                      {comment.author.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">
                        {comment.author.name}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/80 break-words">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
            <InfiniteScrollTrigger
              onIntersect={() => fetchNextPage()}
              isEnabled={!!hasNextPage}
              isFetching={isFetchingNextPage}
            />
          </div>
        )}
      </div>

      {/* Fixed Bottom Input Section */}
      <div className="shrink-0 p-8 border-t border-border/40 bg-muted/5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Textarea
            placeholder="Write a comment..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[50px] w-full resize-none border-border/50 bg-background focus:ring-1 focus:ring-primary/20 transition-all rounded-xl p-4 text-sm"
            disabled={isCreating}
          />
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              size="sm"
              className="rounded-full px-6 font-bold"
              disabled={!content.trim() || isCreating}
            >
              {isCreating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Post Comment
                  <Send className="ml-2 h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CommentView;
