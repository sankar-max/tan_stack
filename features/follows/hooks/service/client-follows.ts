import { api } from "@/lib/api"

export const FOLLOWS_API_CONSTANTS = {
  TOGGLE_FOLLOW: "/user/follow",
}

class FollowsService {
  async toggleFollow({ userId }: { userId: string }) {
    return (await api.post(FOLLOWS_API_CONSTANTS.TOGGLE_FOLLOW, { userId }))
      .data
  }
}

export const followsService = new FollowsService()
