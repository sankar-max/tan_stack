import { useQuery } from "@tanstack/react-query"
import { searchPosts } from "../actions"

type SearchPostsResult = Awaited<ReturnType<typeof searchPosts>>

export function useSearchPosts(query: string) {
  return useQuery<SearchPostsResult>({
    queryKey: ["posts", "search", query],
    queryFn: () => searchPosts({ query }),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60, // 1 minute
  })
}
