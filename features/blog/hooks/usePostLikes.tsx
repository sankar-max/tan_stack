import { postService } from "@/features/blog"
import { useQuery } from "@tanstack/react-query"
import { postKeys } from "../utils/postKey"

export const usePostLikes = ({ postId }: { postId: number }) => {
  const { data, isLoading, error } = useQuery({
    queryKey: [postKeys.likes(postId)],
    queryFn: () => postService.getPostLikes(postId, { page: 1, limit: 10 }),
    enabled: !!postId,
  })

  return { data, isLoading, error }
}
