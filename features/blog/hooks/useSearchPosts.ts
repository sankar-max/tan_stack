import { useQuery } from "@tanstack/react-query"
import { getPostsAction } from "../actions"

export function useSearchPosts(query: string) {
  return useQuery({
    queryKey: ["posts", "search", query],
    queryFn: async () => {
      const result = await getPostsAction({ search: query, published: true })
      if (!result.success) throw new Error(result.message)
      return result.data
    },
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60, // 1 minute
  })
}
