import { postService } from "@/features/blog"
import { useQuery } from "@tanstack/react-query"
import { postKeys } from "../utils/postKey"

export const usePostLikes = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [postKeys.likes(1)],
    queryFn: () => postService.getPostLikes(1, { page: 1, limit: 10 }),
  })

  return { data, isLoading, error }
}
