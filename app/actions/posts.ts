"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { postService } from "@/service/post"
import { CreatePostSchema } from "../api/post/schema"

export type PostState = {
  errors?: {
    title?: string[]
    content?: string[]
    excerpt?: string[]
    form?: string[]
  }
  message?: string | null
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
