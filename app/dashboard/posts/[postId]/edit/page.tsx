import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { postService } from "@/features/blog"
import { PostForm } from "@/features/blog"
import { updatePost } from "@/features/blog/server"

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
    const response = await postService.getPost(postId)
    post = response.data
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
