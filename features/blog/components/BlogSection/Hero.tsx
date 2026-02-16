"use client"

import React from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface HeroProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  debouncedQuery: string
  isSearching: boolean
  postsCount: number
}

export function Hero({
  searchQuery,
  setSearchQuery,
  debouncedQuery,
  isSearching,
  postsCount,
}: HeroProps) {
  return (
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
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
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
            Found {postsCount} results for{" "}
            <span className="font-semibold text-foreground">
              &quot;{debouncedQuery}&quot;
            </span>
          </p>
        )}
      </motion.div>
    </div>
  )
}
