"use client";

import { Grid } from "@/features/blog/components/BlogSection/Grid";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";
import Link from "next/link";

interface BlogSearchViewProps {
  query: string;
  posts: any[];
  total: number;
}

export default function BlogSearchView({ query, posts, total }: BlogSearchViewProps) {
  if (!query) {
    return (
      <div className="container py-20 text-center space-y-4 mx-auto px-4">
        <Search className="h-12 w-12 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-bold">Search Stories</h1>
        <p className="text-muted-foreground">
          Enter a keyword to search our blog
        </p>
        <Link href="/blog">
          <Button variant="link">Back to Blog</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-10 mx-auto px-4">
      <div className="space-y-4">
        <Link href="/blog">
          <Button variant="ghost" className="-ml-4 gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to Stories
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">
          Search results for &quot;{query}&quot;
        </h1>
        <p className="text-muted-foreground">Found {total} matching stories</p>
      </div>

      <Grid posts={posts} isLoading={false} error={null} />
    </div>
  );
}
