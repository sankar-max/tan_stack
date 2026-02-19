"use client"

import React from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { Card } from "./Card"

import { PostListItemsT } from "../../types"

interface GridProps {
  isLoading: boolean
  error: Error | null
  posts: PostListItemsT[]
  status?: string
  errorMessage?: string
}

export function Grid({
  isLoading,
  error,
  posts = [],
  status,
  errorMessage,
}: GridProps) {
  return (
    <div key={posts.length} className="w-full">
      {isLoading ? (
        <div className="flex flex-col items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary/50 mb-4" />
          <p className="text-muted-foreground font-medium">
            Fetching content...
          </p>
        </div>
      ) : error || status === "error" ? (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="bg-destructive/10 p-4 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-foreground font-medium mb-1">
            Could not load posts
          </p>
          <p className="text-muted-foreground text-sm">
            {error?.message || errorMessage}
          </p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-32">
          <p className="text-xl text-muted-foreground font-medium">
            No stories found.
          </p>
          <p className="text-sm text-muted-foreground/60 mt-2">
            Try a different keyword.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
