import { cache } from "react"
import type { Metadata, ResolvingMetadata } from "next"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { postKeys } from "@/features/blog/utils/postKey"
import { getPostAction, getPostsAction } from "@/features/blog/actions"
import { siteConfig } from "@/lib/config"
import dynamic from "next/dynamic"

import BlogPostView from "@/features/blog/components/BlogPostView"

export const revalidate = 3600 // Revalidate every hour

export interface PostPageProps {
  params: Promise<{ "blog-id": string }>
}

const getPost = cache(async (blogId: string) => {
  const result = await getPostAction(blogId)
  if (!result.success) return null
  return result.data
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
    const result = await getPostsAction({
      limit: 100,
      published: true,
    })
    if (!result.success) return []
    return result.data.posts.map((post) => ({
      "blog-id": post.id.toString(),
    }))
  } catch (error) {
    console.error("Failed to generate static params for blog posts:", error)
    return []
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { "blog-id": blogId } = await params
  const post = await getPost(blogId)
  const queryClient = new QueryClient()

  if (!post) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    )
  }

  await queryClient.prefetchQuery({
    queryKey: ["post", blogId],
    queryFn: () => getPostAction(blogId),
  })

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "image": [siteConfig.ogImage],
    "datePublished": post.createdAt ? new Date(post.createdAt).toISOString() : "",
    "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : "",
    "author": [
      {
        "@type": "Person",
        "name": post.author?.name || "Anonymous",
        "url": `${siteConfig.url}/user/${post.author?.id}`,
      },
    ],
    "publisher": {
      "@type": "Organization",
      "name": siteConfig.name,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteConfig.url}/logo.png`,
      },
    },
    "description": post.excerpt || "",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlogPostView params={params} />
      </HydrationBoundary>
    </>
  )
}
