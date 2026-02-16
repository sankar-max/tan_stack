import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postService } from "../services"
import { postKeys } from "../utils/postKey"
import { PostListResponse, PostListItemsT } from "../types"
import { ApiSuccess } from "@/lib/api/api-response"
import { toast } from "sonner"
import axios from "axios"

export const useToggleLike = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string | number) => postService.toggleLike(postId),
    // Optimistic Update
    onMutate: async (postId) => {
      const idStr = postId.toString()
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: postKeys.all })
      await queryClient.cancelQueries({ queryKey: ["post", idStr] })

      // Snapshot the previous values
      const previousPostsPages = queryClient.getQueriesData<
        ApiSuccess<PostListResponse>
      >({
        queryKey: postKeys.all,
      })
      const previousSinglePost = queryClient.getQueryData<
        ApiSuccess<PostListItemsT>
      >(["post", idStr])

      // 1. Optimistically update the list
      queryClient.setQueriesData<ApiSuccess<PostListResponse>>(
        { queryKey: postKeys.all },
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: {
              ...old.data,
              posts: old.data.posts.map((post) => {
                if (post.id === Number(postId)) {
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
          }
        },
      )

      // 2. Optimistically update the single post if it exists
      if (previousSinglePost) {
        queryClient.setQueryData<ApiSuccess<PostListItemsT>>(["post", idStr], {
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

      // Return a context object with the snapshotted values
      return { previousPostsPages, previousSinglePost, idStr }
    },
    onSuccess: (response) => {
      if (response.data.liked) {
        toast.success("Post liked!")
      } else {
        toast.info("Post unliked")
      }
    },
    // If the mutation fails, use the context returned from onMutate to roll back
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
    // Always refetch after error or success:
    onSettled: (data, error, postId) => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
      queryClient.invalidateQueries({ queryKey: ["post", postId.toString()] })
    },
  })
}
