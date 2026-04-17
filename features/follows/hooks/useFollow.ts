import { useMutation, useQueryClient } from "@tanstack/react-query"
import { followsService } from "./service/client-follows"
import { postKeys } from "@/features/blog/utils/postKey"
import { toast } from "sonner"

export function useFollow() {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending, isError, error } = useMutation({
    mutationFn: (userId: string) => followsService.toggleFollow({ userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.all })
      queryClient.invalidateQueries({ queryKey: ["post"] })
      toast.success("Follow status updated")
    },
  })
  return {
    toggleFollow: mutateAsync,
    isPending,
    isError,
    error,
  }
}
