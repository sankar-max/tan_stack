import { PostListItemsT, PostListResponse } from "@/app/blog/types"
import { api } from "../api"
import { POST_API_CONSTANTS } from "./api-constants"
import { AxiosRequestConfig } from "axios"

class PostService {
  async getPosts(
    params?: {
      search?: string
      page?: number
      limit?: number
      authorId?: string
      published?: boolean
    },
    options?: AxiosRequestConfig,
  ) {
    return api.get<PostListResponse>(POST_API_CONSTANTS.GET_POSTS, {
      params,
      ...options,
    })
  }

  async getPost(id: string) {
    return api.get<PostListItemsT>(POST_API_CONSTANTS.GET_POST(id))
  }

  async toggleLike(postId: string | number) {
    return api.post<{ liked: boolean; totalLikes: number }>(
      POST_API_CONSTANTS.LIKE_POST,
      { postId: postId.toString() },
    )
  }

  async createPost(
    data: {
      title: string
      content: string
      excerpt?: string
      published: boolean
    },
    options?: AxiosRequestConfig,
  ) {
    return api.post<PostListItemsT>(
      POST_API_CONSTANTS.CREATE_POST,
      data,
      options,
    )
  }

  async updatePost(
    id: string,
    data: {
      title?: string
      content?: string
      excerpt?: string
      published?: boolean
    },
    options?: AxiosRequestConfig,
  ) {
    return api.patch<PostListItemsT>(
      POST_API_CONSTANTS.UPDATE_POST(id),
      data,
      options,
    )
  }

  async deletePost(id: string, options?: AxiosRequestConfig) {
    return api.delete(POST_API_CONSTANTS.DELETE_POST(id), options)
  }
}

export const postService = new PostService()
