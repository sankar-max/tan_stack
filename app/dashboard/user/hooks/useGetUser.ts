import { userService } from "@/features/dashboard/user/client-service"
import { useQuery } from "@tanstack/react-query"

export const useGetUser = ({ userId }: { userId: string }) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getUser({ userId }),
    enabled: !!userId,
  })
}
