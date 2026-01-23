import { db } from "@/db"
import { posts } from "@/db/schema"

export type PostListItemsT = typeof posts.$inferSelect & {
  author: {
    id: number
    name: string
    image: string
  }
}
export type PostListResponse = {
  posts: PostListItemsT[]
  total: number
  page: number
  limit: number
  totalPages: number
}
