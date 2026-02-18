import {
  PostCommentsResponse,
  PostLikesResponse,
  PostListItemsT,
  PostListResponse,
  Comments,
} from "../types"
import { api } from "@/lib/api"
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

  async getPostLikes(
    postId: number,
    params?: { page?: number; limit?: number },
  ) {
    return api.get<PostLikesResponse>(
      POST_API_CONSTANTS.VIEW_POST_LIKES(postId),
      { params },
    )
  }

  async getPostComments(
    postId: number,
    params?: { page?: number; limit?: number },
  ) {
    const res = await api.get<PostCommentsResponse>(
      POST_API_CONSTANTS.VIEW_POST_COMMENTS(postId),
      { params },
    )
    return res.data
  }

  async createComment(postId: number, content: string) {
    const res = await api.post<Comments>(
      POST_API_CONSTANTS.CREATE_COMMENT(postId),
      { content },
    )
    return res.data
  }
}

export const postService = new PostService()
