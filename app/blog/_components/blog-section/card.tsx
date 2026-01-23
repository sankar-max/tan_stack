"use client"

import React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowRight } from "lucide-react"
import { motion, Variants } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostListItemsT } from "../../types"

const item: Variants = {
  hidden: { opacity: 0, y: 15, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: 0.1,
      ease: "easeOut",
    },
  },
}

interface CardProps {
  post: PostListItemsT
}

export function Card({ post }: CardProps) {
  return (
    <motion.div variants={item}>
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <article className="flex flex-col h-full bg-card rounded-2xl border border-border/40 hover:border-primary/20 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden relative">
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="p-7 flex flex-col flex-1 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 ring-1 ring-border/50">
                  <AvatarImage src={post.author.image ?? undefined} />
                  <AvatarFallback className="text-[10px]">
                    {post.author.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-muted-foreground">
                  {post.author.name}
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
  )
}
