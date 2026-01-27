"use client"
import { use } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { AnimatePresence, motion, Variants } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { usePost } from "./hooks"
import { PostParams } from "./page"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
}

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function PostPage({ params }: PostParams) {
  const { "blog-id": blogId } = use(params)
  const { data: result, isLoading, error } = usePost(blogId)

  const post = result?.data

  console.log("post", post)
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Crafting your story...
        </p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Oops! Post Not Found</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          The story you&apos;re looking for might have been moved or deleted.
        </p>
        <Link href="/blog">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Stories
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <motion.main
      initial="hidden"
      animate="visible"
      variants={stagger}
      className="container max-w-4xl mx-auto py-12 px-4 md:py-20"
    >
      <motion.div variants={fadeInUp} className="mb-10">
        <Link href="/blog">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 -ml-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
      </motion.div>

      <article className="space-y-10">
        {/* Header Section */}
        <header className="space-y-6">
          <motion.div variants={fadeInUp}>
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1"
            >
              Article
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-linear-to-b from-foreground to-foreground/70">
              {post.title}
            </h1>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-6 py-4"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                <AvatarImage src={post.author.image ?? undefined} />
                <AvatarFallback className="bg-primary/5 text-primary text-xs">
                  {post.author.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">
                  {post.author.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  Author
                </span>
              </div>
            </div>

            <Separator orientation="vertical" className="h-8 hidden md:block" />

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 opacity-70" />
                <span>{format(new Date(post.createdAt), "MMMM d, yyyy")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 opacity-70" />
                <span>5 min read</span>
              </div>
            </div>
          </motion.div>
        </header>

        {/* Content Section */}
        <motion.div
          variants={fadeInUp}
          className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border/40"
        >
          <div className="text-xl md:text-2xl font-serif text-foreground/90 leading-relaxed italic border-l-4 border-primary/20 pl-6 mb-12">
            {post.excerpt}
          </div>

          <div
            className="text-lg leading-loose space-y-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        {/* Footer / Share Section */}
        <Separator className="my-12" />

        <motion.footer
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-muted-foreground">
              Share this story
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Link href="/blog">
            <Button className="rounded-full px-8 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
              Explore More Stories
            </Button>
          </Link>
        </motion.footer>
      </article>
    </motion.main>
  )
}
