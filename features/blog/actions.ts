"use server"

import { db } from "@/db"
import { posts, user } from "@/db/schema"
import { and, desc, eq, ilike, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { postServiceServer } from "./server"
import { CreatePostSchema } from "./services/schema"
import { ApiSuccess, ApiFailure } from "@/lib/api/api-response"

export type PostState = {
  errors?: {
    title?: string[]
    content?: string[]
    excerpt?: string[]
    form?: string[]
  }
  message?: string | null
}

/**
 * Standardized response wrapper for Server Actions to match API structure
 */
function actionOk<T>(data: T, message = "Success", status = 200): ApiSuccess<T> {
  return { success: true, data, message, status }
}

function actionFail(message: string, status = 400, code = "BAD_REQUEST"): ApiFailure {
  return { success: false, message, status, code }
}

// ───────────────────────────────────────────────
// FETCHING ACTIONS
// ───────────────────────────────────────────────

export async function getPostsAction(params: {
  search?: string
  cursor?: number
  limit?: number
  authorId?: string
  published?: boolean
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const currentUserId = session?.user?.id || null

  try {
    const result = await postServiceServer.getPosts({
      ...params,
      limit: params.limit ?? 12,
      currentUserId,
    })
    return actionOk(result)
  } catch (error) {
    console.error("getPostsAction error:", error)
    return actionFail("Failed to fetch posts", 500, "INTERNAL_SERVER_ERROR")
  }
}

export async function getPostAction(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  const currentUserId = session?.user?.id || null

  try {
    const postId = Number(id)
    if (isNaN(postId)) return actionFail("Invalid post ID", 400, "INVALID_ID")

    const post = await postServiceServer.getPost({
      postId,
      userId: currentUserId,
    })

    if (!post) return actionFail("Post not found", 404, "NOT_FOUND")

    return actionOk(post)
  } catch (error) {
    console.error("getPostAction error:", error)
    return actionFail("Failed to fetch post", 500, "INTERNAL_SERVER_ERROR")
  }
}

// ───────────────────────────────────────────────
// MUTATION ACTIONS
// ───────────────────────────────────────────────

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
    await postServiceServer.createPost({
      ...validatedData.data,
      excerpt: validatedData.data.excerpt || undefined,
      authorId: session.user.id,
    })
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
    await postServiceServer.updatePost(postId, {
      ...validatedData.data,
      excerpt: validatedData.data.excerpt || undefined,
    })
  } catch {
    return {
      message: "Database Error: Failed to Update Post.",
    }
  }

  revalidatePath("/dashboard/posts")
  revalidatePath(`/blog/${postId}`)
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
    await postServiceServer.deletePost(postId)
  } catch {
    return {
      message: "Database Error: Failed to Delete Post.",
    }
  }

  revalidatePath("/dashboard/posts")
  revalidatePath("/blog")
  return { message: "Post deleted successfully" }
}

export async function toggleLikeAction(postId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) return actionFail("Unauthorized", 401, "UNAUTHORIZED")

  try {
    const result = await postServiceServer.toggleLike({
      postId,
      userId: session.user.id,
    })
    revalidatePath("/blog")
    revalidatePath(`/blog/${postId}`)
    return actionOk(result)
  } catch (error) {
    console.error("toggleLikeAction error:", error)
    return actionFail("Failed to toggle like", 500)
  }
}

export async function toggleBookmarkAction(postId: number) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) return actionFail("Unauthorized", 401, "UNAUTHORIZED")

  try {
    const result = await postServiceServer.toggleBookmark({
      postId,
      userId: session.user.id,
    })
    revalidatePath("/blog")
    revalidatePath(`/blog/${postId}`)
    revalidatePath("/dashboard/library")
    return actionOk(result)
  } catch (error) {
    console.error("toggleBookmarkAction error:", error)
    return actionFail("Failed to toggle bookmark", 500)
  }
}

export async function getPostCommentsAction(postId: number, cursor?: number, limit = 10) {
  try {
    const result = await postServiceServer.getPostComments({
      postId,
      cursor,
      limit,
    })
    return actionOk(result)
  } catch (error) {
    console.error("getPostCommentsAction error:", error)
    return actionFail("Failed to fetch comments", 500)
  }
}

export async function createCommentAction(postId: number, content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) return actionFail("Unauthorized", 401, "UNAUTHORIZED")

  try {
    const result = await postServiceServer.createPostComment({
      postId,
      userId: session.user.id,
      content,
    })
    revalidatePath(`/blog/${postId}`)
    return actionOk(result)
  } catch (error) {
    console.error("createCommentAction error:", error)
    return actionFail("Failed to create comment", 500)
  }
}

export async function getPostLikesAction(postId: number, cursor?: string, limit = 10) {
  try {
    const result = await postServiceServer.getPostLikes({
      postId,
      cursor,
      limit,
    })
    return actionOk(result)
  } catch (error) {
    console.error("getPostLikesAction error:", error)
    return actionFail("Failed to fetch post likes", 500)
  }
}
