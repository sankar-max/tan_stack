"use client"

import { useState } from "react"
import { usePublicPosts } from "../hooks/usePublicPosts"
import { useDebounce } from "../hooks/useDebounce"
import { Hero } from "./BlogSection/Hero"
import { Grid } from "./BlogSection/Grid"
import { InfiniteScrollTrigger } from "./InfiniteScrollTrigger"

function BlogSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Fetch public posts with debounced search query
  const {
    data: result,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePublicPosts(debouncedQuery)

  console.log(result, "result")

  const isSearching = debouncedQuery.length > 0

  const posts = result?.pages.flatMap((page) => page.posts) || []
  const totalPosts = result?.pages[0]?.total || 0

  return (
    <div className="space-y-16 pb-20">
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        debouncedQuery={debouncedQuery}
        isSearching={isSearching}
        postsCount={totalPosts}
      />
      <Grid
        isLoading={isLoading}
        error={error as Error | null}
        posts={posts}
        status={result?.pages ? "success" : undefined}
        errorMessage={error instanceof Error ? error.message : undefined}
      />
      <InfiniteScrollTrigger
        onIntersect={() => fetchNextPage()}
        isEnabled={!!hasNextPage}
        isFetching={isFetchingNextPage}
      />
    </div>
  )
}

export default BlogSection
