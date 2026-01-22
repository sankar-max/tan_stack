"use client"

import React, { useState } from "react"
import { usePublicPosts } from "../hooks/get-posts"
import { useSearchPosts } from "../hooks/use-search-posts"
import { useDebounce } from "../hooks/use-debounce"
import { Hero } from "./blog-section/hero"
import { Grid } from "./blog-section/grid"

function BlogSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 300)

  // Fetch public posts and search posts
  const publicPostsQuery = usePublicPosts()
  const searchPostsQuery = useSearchPosts(debouncedQuery)

  const isSearching = debouncedQuery.length > 0
  const currentQuery = isSearching ? searchPostsQuery : publicPostsQuery
  const { data: result, isLoading, error } = currentQuery

  const posts = result?.data || []

  return (
    <div className="space-y-16 pb-20">
      <Hero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        debouncedQuery={debouncedQuery}
        isSearching={isSearching}
        postsCount={posts.length}
      />
      
      <Grid
        isLoading={isLoading}
        error={error}
        posts={posts}
        status={result?.status}
        errorMessage={result?.error}
      />
    </div>
  )
}

export default BlogSection
