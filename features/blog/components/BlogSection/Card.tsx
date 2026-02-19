"use client"

import React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowRight, Heart, MessageCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostListItemsT } from "../../types"
import { useToggleLike } from "../../hooks/useToggleLike"
import { useModalStore } from "@/features/blog/store/modal"

interface CardProps {
  post: PostListItemsT
}

export function Card({ post }: CardProps) {
  const { mutate: toggleLike, isPending } = useToggleLike()
  const { openModal } = useModalStore()

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isPending) return
    toggleLike(post.id)
  }

  return (
    <div className="h-full">
      <Link href={`/blog/${post.id}`} className="group block h-full">
        <article className="flex flex-col h-full bg-card rounded-2xl border border-border/40 hover:border-primary/20 transition-all duration-300 hover:shadow-lg overflow-hidden relative">
          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="p-7 flex flex-col flex-1 relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6 ring-1 ring-border/50">
                  <AvatarImage src={post.author?.image ?? undefined} />
                  <AvatarFallback className="text-[10px]">
                    {post.author?.name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-muted-foreground">
                  {post.author?.name || "Anonymous"}
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

            <div className="flex items-center gap-4 mt-auto">
              <div
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors duration-300 cursor-pointer ${
                  post.isLiked
                    ? "text-red-500"
                    : "text-muted-foreground hover:text-red-400"
                } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-all duration-300 ${
                    post.isLiked ? "fill-current" : ""
                  }`}
                />
                <span
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    openModal("LIKE_VIEW", {
                      title: "Likes",
                      description: "People who liked this post",
                      props: { postId: post.id },
                    })
                  }}
                  className="cursor-pointer hover:underline"
                >
                  {post.totalLikes}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary/80 transition-colors cursor-pointer"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  openModal("COMMENT_VIEW", {
                    title: "Comments",
                    description: "Join the discussion",
                    props: { postId: post.id },
                  })
                }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>{post.totalComments}</span>
              </div>
              <div className="flex items-center text-xs font-medium text-primary ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                Read Story <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </article>
      </Link>
    </div>
  )
}
