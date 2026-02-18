import { posts } from "@/db/schema"

export type PostListItemsT = typeof posts.$inferSelect & {
  author: {
    id: string
    name: string | null
    image: string | null
  } | null
  totalLikes: number
  totalComments: number
  isLiked: boolean
}
export type PostListResponse = {
  posts: PostListItemsT[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export type User = {
  id: string
  name: string
  image: string | null
  email: string
}
export type PostLikesResponse = {
  users: User[]
  total: number
  totalPages: number
}

export type PostCommentsResponse = {
  comments: Comments[]
  total: number
  totalPages: number
}

export type Comments = {
  id: number
  content: string
  createdAt: Date
  updatedAt: Date
  author: User
}
