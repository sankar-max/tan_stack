"use client";

import { format } from "date-fns";
import { motion, type Variants } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  Loader2,
  MessageCircle,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToggleLike, usePost } from "@/features/blog/hooks";
import CommentView from "./modal/CommentView";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

interface BlogPostViewProps {
  params: Promise<{ "blog-id": string }>;
}

export default function BlogPostView({ params }: BlogPostViewProps) {
  const { "blog-id": blogId } = use(params);
  const { data: post, isLoading, error } = usePost(blogId);
  const { mutate: toggleLike, isPending } = useToggleLike();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isPending || !post) return;
    toggleLike(post.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Crafting your story...
        </p>
      </div>
    );
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
    );
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
        <header className="space-y-6 max-w-2xl mx-auto text-center">
          <motion.div variants={fadeInUp}>
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1"
            >
              Story
            </Badge>
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight leading-[1.1] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
              {post.title}
            </h1>
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-center gap-6 py-4"
          >
            <div className="flex items-center gap-3 bg-muted/30 pl-2 pr-4 py-1.5 rounded-full border border-border/40">
              <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                <AvatarImage src={post?.author?.image ?? undefined} />
                <AvatarFallback className="bg-primary/5 text-primary text-[10px]">
                  {post?.author?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left leading-none gap-0.5">
                <span className="text-sm font-semibold text-foreground">
                  {post?.author?.name}
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
          className="prose prose-lg dark:prose-invert max-w-2xl mx-auto prose-headings:font-serif prose-headings:font-bold prose-p:font-serif prose-p:text-lg prose-p:leading-loose prose-p:text-foreground/90 prose-a:text-primary prose-img:rounded-xl prose-img:shadow-lg"
        >
          {post.excerpt && (
            <div className="text-xl md:text-2xl font-serif text-foreground/80 leading-relaxed italic border-l-4 border-primary/20 pl-6 mb-12">
              {post.excerpt}
            </div>
          )}

          <div
            className="font-serif sm:text-lg md:text-xl leading-relaxed tracking-wide space-y-8"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>

        {/* Footer / Interaction Section */}
        <div className="max-w-2xl mx-auto">
          <Separator className="my-12" />

          <motion.footer
            variants={fadeInUp}
            className="flex flex-wrap items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`gap-2 rounded-full px-5 py-5 border group/like transition-all duration-300 ${
                  post.isLiked
                    ? "text-red-500 bg-red-50/50 border-red-100 dark:bg-red-500/10 dark:border-red-500/20"
                    : "text-muted-foreground hover:text-red-400 hover:bg-red-50/30 hover:border-red-100/50"
                }`}
                disabled={isPending}
              >
                <motion.div
                  animate={post.isLiked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart
                    className={`h-4 w-4 transition-all duration-300 ${
                      post.isLiked
                        ? "fill-current"
                        : "group-hover/like:scale-110"
                    }`}
                  />
                </motion.div>
                <div className="flex flex-col items-start leading-none gap-0.5">
                  <span className="font-bold text-sm tabular-nums">
                    {post.totalLikes}
                  </span>
                </div>
              </Button>

              <div className="flex items-center gap-2 text-muted-foreground px-4 py-1.5 bg-muted/30 rounded-full border border-transparent">
                <MessageCircle className="h-4 w-4 opacity-70" />
                <span className="font-bold text-sm tabular-nums">
                  {post.totalComments}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-primary/5 hover:text-primary transition-all"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </motion.footer>

          <Separator className="my-20" />
          
          <motion.section variants={fadeInUp} className="max-w-2xl mx-auto pb-20">
            <CommentView postId={post.id} />
          </motion.section>
        </div>
      </article>
    </motion.main>
  );
}
