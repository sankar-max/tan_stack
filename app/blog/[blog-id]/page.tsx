import { cache } from "react"
import type { Metadata, ResolvingMetadata } from "next"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { postKeys } from "@/features/blog/utils/postKey"
import { postService } from "@/features/blog/services"
import { postServiceServer } from "@/features/blog/server"
import { siteConfig } from "@/lib/config"
import dynamic from "next/dynamic"

import BlogPostView from "@/features/blog/components/BlogPostView"

export const revalidate = 3600 // Revalidate every hour

export interface PostPageProps {
  params: Promise<{ "blog-id": string }>
}

const getPost = cache(async (blogId: string) => {
  const post = await postService.getPost(blogId)
  return post?.data ?? null
})

export async function generateMetadata(
  { params }: PostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { "blog-id": blogId } = await params
  const post = await getPost(blogId)

  if (!post) {
    return { title: "Post Not Found" }
  }

  const description =
    post.excerpt ??
    post.content.replace(/<[^>]+>/g, "").slice(0, 160).trimEnd() + "…"

  const previousImages = (await parent).openGraph?.images ?? []

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${blogId}` },
    openGraph: {
      type: "article",
      url: `/blog/${blogId}`,
      title: post.title,
      description,
      publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : "",
      modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : "",
      authors: post.author?.name ? [post.author.name] : [],
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [siteConfig.ogImage],
    },
    robots: { index: true, follow: true },
  }
}

export async function generateStaticParams() {
  try {
    const result = await postServiceServer.getPosts({
      limit: 100,
      cursor: undefined,
      sort: "createdAt",
      order: "desc",
      published: true,
    })
    return result.posts.map((post) => ({
      "blog-id": post.id.toString(),
    }))
  } catch (error) {
    console.error("Failed to generate static params for blog posts:", error)
    return []
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { "blog-id": blogId } = await params
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: postKeys.bySlug(blogId),
    queryFn: () => postService.getPost(blogId),
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogPostView params={params} />
    </HydrationBoundary>
  )
}
