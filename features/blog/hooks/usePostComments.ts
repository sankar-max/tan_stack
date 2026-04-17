import { postService } from "../services"
import { useInfiniteQuery } from "@tanstack/react-query"

export function usePostComments({ postId, limit = 10 }: { postId: number; limit?: number }) {
 return useInfiniteQuery({
  queryKey: ["post-comments", postId, limit],
  queryFn: ({ pageParam }) =>
   postService.getPostComments(postId, { cursor: pageParam, limit }),
  initialPageParam: undefined as number | undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  enabled: !!postId,
 })
}
