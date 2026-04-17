import { useInfiniteQuery } from "@tanstack/react-query"
import { getPostsAction } from "../actions"
import { postKeys } from "../utils/postKey"

export const usePublicPosts = (search: string = "") => {
  return useInfiniteQuery({
    queryKey: [...postKeys.publicLatest(12), search],
    queryFn: async ({ pageParam }) => {
      const result = await getPostsAction({ 
        search, 
        limit: 12, 
        cursor: pageParam as number, 
        published: true 
      })
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    refetchOnMount: "always",
  })
}
