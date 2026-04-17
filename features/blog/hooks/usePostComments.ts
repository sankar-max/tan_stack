import { getPostCommentsAction } from "../actions"
import { useInfiniteQuery } from "@tanstack/react-query"

export function usePostComments({ postId, limit = 10 }: { postId: number; limit?: number }) {
 return useInfiniteQuery({
  queryKey: ["post-comments", postId, limit],
  queryFn: async ({ pageParam }) => {
   const result = await getPostCommentsAction(postId, pageParam as number, limit)
   if (!result.success) throw new Error(result.message)
   return result.data
  },
  initialPageParam: undefined as number | undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  enabled: !!postId,
 })
}
