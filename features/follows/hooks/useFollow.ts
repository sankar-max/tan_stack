import { useMutation, useQueryClient } from "@tanstack/react-query"
import { followsService } from "./service/client-follows"
import { postKeys } from "@/features/blog/utils/postKey"

export function useFollow() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (userId: string) => followsService.toggleFollow({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [postKeys.all] })
    },
  })
  return {
    toggleFollow: mutateAsync,
    isPending,
    isError,
    error,
  }
}
