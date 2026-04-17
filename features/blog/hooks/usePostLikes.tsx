import { getPostLikesAction } from "../actions"
import { useInfiniteQuery } from "@tanstack/react-query"
import { postKeys } from "../utils/postKey"

export const usePostLikes = ({ postId }: { postId: number }) => {
  return useInfiniteQuery({
    queryKey: [postKeys.likes(postId)],
    queryFn: async ({ pageParam }) => {
      const result = await getPostLikesAction(postId, pageParam as string, 10)
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!postId,
  })
}
