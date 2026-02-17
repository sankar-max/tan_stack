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
