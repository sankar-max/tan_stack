import type { Metadata } from "next"
import { PostForm } from "@/features/blog"
import { createPost } from "@/features/blog/actions"

export const metadata: Metadata = {
  title: "Write a Story",
  description: "Create and publish a new blog post on Blog.",
}

export default function NewPostPage() {
  return <PostForm action={createPost} submitLabel="Publish" />
}
