"use client"

import { useState } from "react"
import { usePublicPosts } from "../hooks/usePublicPosts"
import { useDebounce } from "../hooks/useDebounce"
import { Hero } from "./BlogSection/Hero"
import { Grid } from "./BlogSection/Grid"

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
