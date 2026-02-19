import { useMutation, useQueryClient } from "@tanstack/react-query"
import { userService } from "../client-service"
import { UserUpdateInput } from "../schema"
import { toast } from "sonner"

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UserUpdateInput) => userService.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      toast.success("Profile updated successfully")
    },
    onError: () => {
      toast.error("Failed to update profile")
    },
  })
}
