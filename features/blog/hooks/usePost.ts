import { postService } from "@/features/blog"
import { useQuery } from "@tanstack/react-query"

export const usePost = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPost(id),
  })

  return { data, isLoading, error }
}
