import { postService } from "@/service/post"
import { useQuery } from "@tanstack/react-query"

export const usePost = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => postService.getPost(id),
  })

  return { data, isLoading, error }
}
