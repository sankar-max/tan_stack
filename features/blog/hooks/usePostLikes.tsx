import { postService } from "@/features/blog"
import { useInfiniteQuery } from "@tanstack/react-query"
import { postKeys } from "../utils/postKey"

export const usePostLikes = ({ postId }: { postId: number }) => {
  return useInfiniteQuery({
    queryKey: [postKeys.likes(postId)],
    queryFn: ({ pageParam }) =>
      postService.getPostLikes(postId, { cursor: pageParam, limit: 10 }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    enabled: !!postId,
  })
}
