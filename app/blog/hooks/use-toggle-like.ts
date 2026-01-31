import { useMutation, useQueryClient } from "@tanstack/react-query"
import { postService } from "@/service/post"
import { postKeys } from "../lib/post-key"
import { PostListResponse } from "../types"
import { ApiSuccess } from "@/app/api/lib/api-response"

export const useToggleLike = () => {
 const queryClient = useQueryClient()

 return useMutation({
  mutationFn: (postId: string | number) => postService.toggleLike(postId),
  // Optimistic Update
  onMutate: async (postId) => {
   // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
   await queryClient.cancelQueries({ queryKey: postKeys.all })

   // Snapshot the previous value
   const previousPostsPages = queryClient.getQueriesData<ApiSuccess<PostListResponse>>({
    queryKey: postKeys.all
   })

   // Optimistically update to the new value
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
    }
   )

   // Return a context object with the snapshotted value
   return { previousPostsPages }
  },
  // If the mutation fails, use the context returned from onMutate to roll back
  onError: (err, postId, context) => {
   if (context?.previousPostsPages) {
    context.previousPostsPages.forEach(([queryKey, data]) => {
     queryClient.setQueryData(queryKey, data)
    })
   }
  },
  // Always refetch after error or success:
  onSettled: () => {
   queryClient.invalidateQueries({ queryKey: postKeys.all })
  },
 })
}
