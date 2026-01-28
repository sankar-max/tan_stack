import { PostListItemsT, PostListResponse } from "@/app/blog/types"
import { api } from "../api"
import { POST_API_CONSTANTS } from "./api-constants"
import { AxiosRequestConfig } from "axios"

class PostService {
  async getPosts(
    params?: { search?: string; page?: number; limit?: number },
    options?: AxiosRequestConfig
  ) {
    return api.get<PostListResponse>(POST_API_CONSTANTS.GET_POSTS, {
      params,
      ...options,
    })
  }

  async getPost(id: string) {
    return api.get<PostListItemsT>(POST_API_CONSTANTS.GET_POST(id))
  }
}

export const postService = new PostService()
