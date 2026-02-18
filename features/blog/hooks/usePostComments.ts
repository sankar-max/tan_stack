import { postService } from "@/features/blog"
import { useQuery } from "@tanstack/react-query"

export function usePostComments({ postId = 1, page = 1, limit = 10 }: { postId: number; page?: number; limit?: number }) {
 const { data, isLoading, error } = useQuery({
  queryKey: ["post-comments", postId, page, limit],
  queryFn: () => postService.getPostComments(postId, { page, limit }),
 })
 return { data, isLoading, error }
}
