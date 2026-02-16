"use client"

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, AlertCircle } from "lucide-react"
import { Card } from "./Card"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

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
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-20"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary/50 mb-4" />
            <p className="text-muted-foreground font-medium">
              Fetching content...
            </p>
          </motion.div>
        ) : error || status === "error" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-20 text-center"
          >
            <div className="bg-destructive/10 p-4 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-foreground font-medium mb-1">
              Could not load posts
            </p>
            <p className="text-muted-foreground text-sm">
              {error?.message || errorMessage}
            </p>
          </motion.div>
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-32"
          >
            <p className="text-xl text-muted-foreground font-medium">
              No stories found.
            </p>
            <p className="text-sm text-muted-foreground/60 mt-2">
              Try a different keyword.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {posts.map((post) => (
              <Card key={post.id} post={post} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
