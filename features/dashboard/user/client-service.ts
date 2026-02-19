import { api } from "@/lib/api"
import { USER_API_CONSTANTS } from "./api-constants"
import { UserUpdateInput } from "./schema"
import { User } from "./types"

class UserService {
  async getUser({ userId }: { userId: string }) {
    return (
      await api.get<User>(USER_API_CONSTANTS.GET_USER, { params: { userId } })
    ).data
  }

  async updateUser(data: UserUpdateInput) {
    return (await api.put<User>(USER_API_CONSTANTS.GET_USER, data)).data
  }
}

export const userService = new UserService()
