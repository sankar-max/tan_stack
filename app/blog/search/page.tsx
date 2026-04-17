import type { Metadata } from "next"
import { postService } from "@/features/blog/services"
import { Grid } from "@/features/blog/components/BlogSection/Grid"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

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

  if (!query) {
    return (
      <div className="container py-20 text-center space-y-4 mx-auto px-4">
        <Search className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold">Search Stories</h1>
        <p className="text-muted-foreground">
          Enter a keyword to search our blog
        </p>
        <Link href="/blog">
          <Button variant="link">Back to Blog</Button>
        </Link>
      </div>
    )
  }

  const result = await postService.getPosts({
    limit: 50,
    search: query,
  })

  const posts = result?.data?.posts || []
  const total = result?.data?.total || 0

  return (
    <div className="container py-10 space-y-10 mx-auto px-4">
      <div className="space-y-4">
        <Link href="/blog">
          <Button variant="ghost" className="-ml-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Stories
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          Search results for &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">Found {total} matching stories</p>
      </div>

      <Grid posts={posts} isLoading={false} error={null} />
    </div>
  )
}
