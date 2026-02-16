import { posts } from "@/db/schema"

export type PostListItemsT = typeof posts.$inferSelect & {
  author: {
    id: string
    name: string | null // user.name is nullable in schema? No, notNull().
    image: string | null // image is text("image") usually nullable or string.
  }
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
