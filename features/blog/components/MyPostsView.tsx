"use client";

import { Button } from "@/components/ui/button";
import { Plus, Layers } from "lucide-react";
import Link from "next/link";
import { PostList } from "@/features/blog";
import {
  dehydrate,
  HydrationBoundary,
} from "@tanstack/react-query";

interface MyPostsViewProps {
  userId: string;
  user?: any;
  dehydratedState: any;
}

export default function MyPostsView({ userId, user, dehydratedState }: MyPostsViewProps) {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-1">
            <Layers size={12} />
            Management
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">My Stories</h1>
          <p className="text-sm text-muted-foreground font-medium">
            Manage your blog posts, drafts, and published content.
          </p>
        </div>
        <Link href="/dashboard/posts/new">
          <Button className="rounded-full px-6 py-5 h-auto text-sm font-bold shadow-md hover:shadow-lg transition-all active:scale-95">
            <Plus className="mr-2 h-4 w-4" /> Write Story
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="bg-card/30 rounded-3xl border border-border/40 p-1 sm:p-2">
        <HydrationBoundary state={dehydratedState}>
          <PostList userId={userId} />
        </HydrationBoundary>
      </div>
    </div>
  );
}
