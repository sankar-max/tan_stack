"use client"

import { PostForm } from "@/features/blog"
import { createPost } from "@/features/blog/server"

export default function NewPostPage() {
  return <PostForm action={createPost} submitLabel="Publish" />
}
