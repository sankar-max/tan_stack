"use client"

import { createPost, PostForm } from "@/features/blog"

export default function NewPostPage() {
  return <PostForm action={createPost} submitLabel="Publish" />
}
