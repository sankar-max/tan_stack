import { db } from "@/db"
import { ApiResponse } from "../api/lib/api-response"

export type PostListItemsT = Awaited<
  ReturnType<
    typeof db.query.posts.findMany<{
      with: {
        author: { columns: { id: true; name: true; image: true } }
      }
    }>
  >
>[number]
export type PostListResponse = {
  posts: PostListItemsT[]
  total: number
  page: number
  limit: number
  totalPages: number
}
