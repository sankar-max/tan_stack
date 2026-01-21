"use client"

import React, { useState } from "react"
import { usePublicPosts } from "../hooks/get-posts"
import { useSearchPosts } from "../hooks/use-search-posts"
import { useDebounce } from "../hooks/use-debounce"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { format } from "date-fns"
import { Search, Loader2, AlertCircle, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

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

const item = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
}

function BlogSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedQuery = useDebounce(searchQuery, 300)

  const publicPostsQuery = usePublicPosts()
  const searchPostsQuery = useSearchPosts(debouncedQuery)
  const isSearching = debouncedQuery.length > 0
  const currentQuery = isSearching ? searchPostsQuery : publicPostsQuery
  const { data: result, isLoading, error } = currentQuery

  const posts = result?.data || []

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-8 pt-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
          <Badge
            variant="outline"
            className="rounded-full px-4 py-1 text-sm border-primary/20 bg-primary/5 text-primary"
          >
            New Updates
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground bg-clip-text text-transparent bg-linear--to-b from-foreground to-foreground/70">
            Stories & Insights
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover the latest thoughts on technology, design, and development.
            Curated for the modern web.
          </p>
        </motion.div>

        {/* Hero Search */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative w-full max-w-lg"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60 group-focus-within:text-primary transition-colors duration-300" />
            <Input
              type="text"
              placeholder="Search articles..."
              className="h-14 pl-12 pr-4 rounded-full border-2 border-muted/40 bg-background/60 backdrop-blur-xl shadow-lg shadow-black/5 hover:border-primary/20 focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary transition-all duration-300 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {isSearching && (
            <p className="absolute -bottom-8 left-0 right-0 text-sm text-muted-foreground animate-in slide-in-from-top-1 fade-in">
              Found {posts.length} results for{" "}
              <span className="font-semibold text-foreground">
                &quot;{debouncedQuery}&quot;
              </span>
            </p>
          )}
        </motion.div>
      </div>
      {/* Grid Content */}
      <div className="w-full">
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
          ) : error || result?.status === "error" ? (
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
                {error?.message || result?.error}
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
                <motion.div key={post.id} variants={item}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block h-full"
                  >
                    <article className="flex flex-col h-full bg-card rounded-2xl border border-border/40 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden relative">
                      {/* Gradient Overlay on Hover */}
                      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="p-7 flex flex-col flex-1 relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6 ring-1 ring-border/50">
                              <AvatarImage
                                src={post.authorImage ?? undefined}
                              />
                              <AvatarFallback className="text-[10px]">
                                {post.authorName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-muted-foreground">
                              {post.authorName}
                            </span>
                          </div>
                          <span className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
                            {format(new Date(post.createdAt), "MMM d")}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                          {post.title}
                        </h3>

                        <p className="text-muted-foreground/80 line-clamp-3 mb-6 text-sm leading-relaxed flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                          Read Story{" "}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </article>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default BlogSection
