import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { postServiceServer } from "@/features/blog/server"
import { PostForm } from "@/features/blog"
import { updatePost } from "@/features/blog/server"

export const metadata: Metadata = {
  title: "Edit Story",
  description: "Edit and update your blog post on Blog.",
}


interface EditPostPageProps {
  params: Promise<{ postId: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { postId } = await params
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session?.user) {
    redirect("/")
  }

  let post
  try {
    post = await postServiceServer.getPost({ 
      postId: Number(postId), 
      userId: session.user.id 
    })
  } catch {
    return <div>Post not found or error loading post.</div>
  }

  if (!post) {
    return <div>Post not found</div>
  }

  if (post.author?.id !== session.user.id) {
    return <div>Unauthorized to edit this post</div>
  }

  const updateAction = updatePost.bind(null, postId)

  return (
    <PostForm
      initialData={{
        id: post.id.toString(),
        title: post.title,
        content: post.content,
        published: post.published,
        excerpt: post.excerpt,
      }}
      action={updateAction}
      submitLabel="Update"
    />
  )
}
