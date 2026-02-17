import { useQuery } from "@tanstack/react-query"
import { postService } from "../services"
import { postKeys } from "../utils/postKey"
export const usePublicPosts = (search?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [...postKeys.publicLatest(12), search],
    queryFn: () => postService.getPosts({ search, limit: 12 }),
    refetchOnMount: "always", // Important for ISR hydration with user-specific data
  })

  return { data, isLoading, error }
}
