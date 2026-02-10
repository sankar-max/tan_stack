"use server";

import { db } from "@/db";
import { posts, user } from "@/db/schema";
import { and, desc, eq, ilike, or } from "drizzle-orm";

// Helper to get current user session
// Helper to get current user session
// async function getCurrentUser() {
//  const session = await auth.api.getSession({ headers: await headers() });
//  if (!session?.user) {
//   throw new Error("Unauthorized");
//  }
//  return session.user;
// }

// ───────────────────────────────────────────────
// Get latest public posts (no auth required)
// ───────────────────────────────────────────────
export async function getPublicPosts(limit = 12) {
 try {
  const data = await db
   .select({
    id: posts.id,
    title: posts.title,
    slug: posts.slug,
    excerpt: posts.excerpt,
    createdAt: posts.createdAt,
    authorName: user.name,
    authorImage: user.image,
   })
   .from(posts)
   .leftJoin(user, eq(posts.authorId, user.id))
   .where(eq(posts.published, true))
   .orderBy(desc(posts.createdAt))
   .limit(limit);

  return {
   status: "success",
   message: data.length ? "Posts fetched successfully" : "No posts found",
   data,
  };
 } catch (error) {
  console.error("getPublicPosts error:", error);
  return {
   status: "error",
   message: "Failed to fetch public posts",
   data: null,
   error: error instanceof Error ? error.message : "Unknown error",
  };
 }
}

// ───────────────────────────────────────────────
// Search posts using simple partial match (ILIKE)
// ───────────────────────────────────────────────
export async function searchPosts({
 query,
 limit = 12,
}: {
 query: string;
 limit?: number;
}) {
 try {
  if (!query?.trim()) {
   return {
    status: "success",
    message: "No search query provided",
    data: [],
   };
  }

  // Public search does not require login
  // await getCurrentUser();

  const searchTerm = query.trim();

  // Simple substring match for title or content
  const data = await db
   .select({
    id: posts.id,
    title: posts.title,
    slug: posts.slug,
    excerpt: posts.excerpt,
    createdAt: posts.createdAt,
    authorName: user.name,
    authorImage: user.image,
   })
   .from(posts)
   .leftJoin(user, eq(posts.authorId, user.id))
   .where(
    and(
     eq(posts.published, true),
     or(
      ilike(posts.title, `%${searchTerm}%`),
      ilike(posts.content, `%${searchTerm}%`)
     )
    )
   )
   .orderBy(desc(posts.createdAt))
   .limit(limit);

  return {
   status: "success",
   message: data.length ? `Found ${data.length} matching posts` : "No matching posts found",
   data,
  };
 } catch (error) {
  console.error("searchPosts error:", error);
  return {
   status: "error",
   message: "Search failed",
   data: null,
   error: error instanceof Error ? error.message : "Unknown error",
  };
 }
}