"use client"

import { useState } from "react"
import { usePublicPosts } from "../hooks/get-posts"
import { useDebounce } from "../hooks/use-debounce"
import { Hero } from "./blog-section/hero"
import { Grid } from "./blog-section/grid"

function BlogSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Fetch public posts with debounced search query
  const { data: result, isLoading, error } = usePublicPosts(debouncedQuery)

  const isSearching = debouncedQuery.length > 0

  const posts = result?.data
  return (
    <div className="space-y-16 pb-20">
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        debouncedQuery={debouncedQuery}
        isSearching={isSearching}
        postsCount={posts?.total || 0}
      />

      <Grid
        isLoading={isLoading}
        error={error as Error | null}
        posts={posts?.posts || []}
        status={result?.status?.toString()}
        errorMessage={error instanceof Error ? error.message : undefined}
      />
    </div>
  )
}

export default BlogSection
