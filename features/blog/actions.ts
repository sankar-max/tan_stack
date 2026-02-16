"use server"

import { db } from "@/db"
import { posts, user } from "@/db/schema"
import { and, desc, eq, ilike, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { postService } from "./services"
import { CreatePostSchema } from "./services/schema"

export type PostState = {
  errors?: {
    title?: string[]
    content?: string[]
    excerpt?: string[]
    form?: string[]
  }
  message?: string | null
}

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
      .limit(limit)

    return {
      status: "success",
      message: data.length ? "Posts fetched successfully" : "No posts found",
      data,
    }
  } catch (error) {
    console.error("getPublicPosts error:", error)
    return {
      status: "error",
      message: "Failed to fetch public posts",
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// ───────────────────────────────────────────────
// Search posts using simple partial match (ILIKE)
// ───────────────────────────────────────────────
export async function searchPosts({
  query,
  limit = 12,
}: {
  query: string
  limit?: number
}) {
  try {
    if (!query?.trim()) {
      return {
        status: "success",
        message: "No search query provided",
        data: [],
      }
    }

    // Public search does not require login
    // await getCurrentUser();

    const searchTerm = query.trim()

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
            ilike(posts.content, `%${searchTerm}%`),
          ),
        ),
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit)

    return {
      status: "success",
      message: data.length
        ? `Found ${data.length} matching posts`
        : "No matching posts found",
      data,
    }
  } catch (error) {
    console.error("searchPosts error:", error)
    return {
      status: "error",
      message: "Search failed",
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export async function createPost(prevState: PostState, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return {
      message: "Unauthorized",
    }
  }

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt")?.toString() || undefined,
    published: formData.get("published") === "true",
  }

  const validatedData = CreatePostSchema.safeParse(rawData)

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Post.",
    }
  }

  try {
    const reqHeaders = await headers()
    await postService.createPost(
      {
        ...validatedData.data,
        excerpt: validatedData.data.excerpt || undefined,
      },
      {
        headers: {
          Cookie: reqHeaders.get("cookie") || "",
        },
      },
    )
  } catch (error) {
    console.error("Create Post Error:", error)
    return {
      message:
        error instanceof Error
          ? error.message
          : "Database Error: Failed to Create Post.",
    }
  }

  revalidatePath("/dashboard/posts")
  revalidatePath("/blog")
  redirect("/dashboard/posts")
}

export async function updatePost(
  postId: string,
  prevState: PostState,
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return {
      message: "Unauthorized",
    }
  }

  const rawData = {
    title: formData.get("title"),
    content: formData.get("content"),
    excerpt: formData.get("excerpt")?.toString() || undefined,
    published: formData.get("published") === "true",
  }

  const validatedData = CreatePostSchema.partial().safeParse(rawData)

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Post.",
    }
  }

  try {
    const reqHeaders = await headers()
    await postService.updatePost(
      postId,
      {
        ...validatedData.data,
        excerpt: validatedData.data.excerpt || undefined,
      },
      {
        headers: {
          Cookie: reqHeaders.get("cookie") || "",
        },
      },
    )
  } catch {
    return {
      message: "Database Error: Failed to Update Post.",
    }
  }

  revalidatePath("/dashboard/posts")
  revalidatePath(`/blog/${postId}`) // In case slug didn't change, but content did
  revalidatePath("/blog")
  redirect("/dashboard/posts")
}

export async function deletePost(postId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    return {
      message: "Unauthorized",
    }
  }

  try {
    const reqHeaders = await headers()
    // Ideally check if user is author before deleting
    // service.deletePost handles API call, API should handle auth check
    // user.id check in where clause of delete query in API
    await postService.deletePost(postId, {
      headers: {
        Cookie: reqHeaders.get("cookie") || "",
      },
    })
  } catch {
    return {
      message: "Database Error: Failed to Delete Post.",
    }
  }

  revalidatePath("/dashboard/posts")
  revalidatePath("/blog")
  return { message: "Post deleted successfully" }
}
