"use client"

import { useState } from "react"
import { usePostComments } from "../../hooks/usePostComments"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postService } from "../../services"
import { formatDistanceToNow } from "date-fns"
import { Loader2, Send } from "lucide-react"

type Props = {
  postId: number
}

function CommentView({ postId }: Props) {
  const [content, setContent] = useState("")
  const queryClient = useQueryClient()

  const {
    data: comments,
    isLoading: commentsLoading,
    error: commentsError,
  } = usePostComments({ postId: postId! })

  const { mutate: createComment, isPending: isCreating } = useMutation({
    mutationFn: (newComment: string) =>
      postService.createComment(postId!, newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] })
      setContent("")
    },
  })

  if (!postId) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    createComment(content)
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex-1 min-h-0">
        {commentsLoading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : commentsError ? (
          <div className="p-4 text-center text-sm text-red-500">
            Error loading comments. Please try again.
          </div>
        ) : !comments?.comments?.length ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="flex flex-col gap-6">
              {comments.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={comment.author.image || undefined}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>
                      {comment.author.name?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {comment.author.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 mt-auto pt-4 border-t"
      >
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] resize-none"
          disabled={isCreating}
        />
        <div className="flex justify-end">
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isCreating}
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Post Comment
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CommentView
