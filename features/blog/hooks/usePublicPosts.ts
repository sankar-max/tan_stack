import { useInfiniteQuery } from "@tanstack/react-query"
import { postService } from "../services"
import { postKeys } from "../utils/postKey"

export const usePublicPosts = (search: string = "") => {
  return useInfiniteQuery({
    queryKey: [...postKeys.publicLatest(12), ""],
    queryFn: ({ pageParam }) =>
      postService.getPosts({ search, limit: 12, cursor: pageParam }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor ?? undefined,
    refetchOnMount: "always",
  })
}
