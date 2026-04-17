import type { Metadata } from "next"
import { postService } from "@/features/blog/services"
import dynamic from "next/dynamic"

const BlogSearchView = dynamic(() => import("@/features/blog/components/BlogSearchView"))

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q: query } = await searchParams
  return {
    title: query ? `Search: "${query}"` : "Search",
    description: query
      ? `Search results for "${query}" on Blog. Find stories and articles matching your interest.`
      : "Search for stories and articles on Blog.",
    robots: { index: false, follow: false },
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: query } = await searchParams

  let posts: any[] = []
  let total = 0

  if (query) {
    const result = await postService.getPosts({
      limit: 50,
      search: query,
    })
    posts = result?.data?.posts || []
    total = result?.data?.total || 0
  }

  return (
    <BlogSearchView 
      query={query || ""} 
      posts={posts} 
      total={total} 
    />
  )
}
