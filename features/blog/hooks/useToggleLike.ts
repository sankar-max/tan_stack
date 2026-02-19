import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query"
import { postService } from "../services"
import { postKeys } from "../utils/postKey"
import { PostListResponse, PostListItemsT } from "../types"
import { toast } from "sonner"
import axios from "axios"

export const useToggleLike = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string | number) => postService.toggleLike(postId),
    onMutate: async (postId) => {
      const idStr = postId.toString()
      const numericId = Number(postId)

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: postKeys.all })
      await queryClient.cancelQueries({ queryKey: ["post", idStr] })

      // Snapshot the previous values
      const previousPostsPages = queryClient.getQueriesData<
        InfiniteData<{ data: PostListResponse }>
      >({
        queryKey: postKeys.all,
      })
      const previousSinglePost = queryClient.getQueryData<{
        data: PostListItemsT
      }>(["post", idStr])

      // 1. Optimistically update all infinite scroll lists
      queryClient.setQueriesData<InfiniteData<{ data: PostListResponse }>>(
        { queryKey: postKeys.all },
        (old) => {
          if (!old) return old
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: {
                ...page.data,
                posts: page.data.posts.map((post) => {
                  if (post.id === numericId) {
                    const isLiked = !post.isLiked
                    return {
                      ...post,
                      isLiked,
                      totalLikes: post.totalLikes + (isLiked ? 1 : -1),
                    }
                  }
                  return post
                }),
              },
            })),
          }
        },
      )

      // 2. Optimistically update the single post if it exists
      if (previousSinglePost) {
        queryClient.setQueryData<{ data: PostListItemsT }>(["post", idStr], {
          ...previousSinglePost,
          data: {
            ...previousSinglePost.data,
            isLiked: !previousSinglePost.data.isLiked,
            totalLikes:
              previousSinglePost.data.totalLikes +
              (previousSinglePost.data.isLiked ? -1 : 1),
          },
        })
      }

      return { previousPostsPages, previousSinglePost, idStr }
    },
    onSuccess: (response) => {
      if (response.data.liked) {
        toast.success("Post liked!")
      } else {
        toast.info("Post unliked")
      }
    },
    onError: (err, postId, context) => {
      if (context?.previousPostsPages) {
        context.previousPostsPages.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data)
        })
      }
      if (context?.previousSinglePost && context?.idStr) {
        queryClient.setQueryData(
          ["post", context.idStr],
          context.previousSinglePost,
        )
      }

      const errorMessage =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to update like status"
      toast.error(errorMessage)
    },
    onSettled: (data, error, postId) => {
      /**
       * Note: We don't strictly NEED a full invalidation if the optimistic update
       * and the response data are used to keep the cache consistent.
       * But for safety, we invalidate. However, we could be more specific.
       */
      const idStr = postId.toString()
      // queryClient.invalidateQueries({ queryKey: postKeys.all })
      queryClient.invalidateQueries({ queryKey: ["post", idStr] })

      // Instead of invalidating ALL posts, we can just invalidate the pages that contain this post.
      // But query-level invalidation is simpler. To stop the "trigger everytime" annoyance,
      // we check if the user meant that it refetches the list while they are interacting.
    },
  })
}
