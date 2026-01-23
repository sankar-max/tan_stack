// Query keys (consistent & serializable)
export const postKeys = {
 all: ["posts"] as const,
 publicLatest: (limit = 12) => [...postKeys.all, "public", "latest", limit] as const,
 bySlug: (slug: string) => [...postKeys.all, "detail", slug] as const,
 // later: myPosts(userId), byTag(tag), etc.
};