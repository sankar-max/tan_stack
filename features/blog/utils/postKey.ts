// Query keys (consistent & serializable)
export const postKeys = {
  all: ["posts"] as const,
  publicLatest: (limit = 12) =>
    [...postKeys.all, "public", "latest", limit] as const,
  bySlug: (id: string) => ["post", id] as const,
  myPosts: (userId: string) => [...postKeys.all, "by-author", userId] as const,
  likes: (postId: number) => [...postKeys.all, "likes", postId] as const,
}
