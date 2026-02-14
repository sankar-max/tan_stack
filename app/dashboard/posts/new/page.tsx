"use client"

import { createPost } from "@/app/actions/posts"
import { PostForm } from "../_components/post-form"

export default function NewPostPage() {
  return <PostForm action={createPost} submitLabel="Publish" />
}
