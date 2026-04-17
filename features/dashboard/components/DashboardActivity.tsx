"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";

export function DashboardActivity() {
  return (
    <Card className="border-none bg-background/50 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates on your stories</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-3 rounded-2xl hover:bg-accent/50 transition-colors group cursor-pointer border border-transparent hover:border-border/50"
          >
            <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <BookOpen size={20} />
            </div>
            <div className="flex-1 overflow-hidden">
              <h4 className="font-bold text-sm truncate">
                The Future of AI in Content Creation
              </h4>
              <p className="text-xs text-muted-foreground">
                Liked by 24 people · 2 hours ago
              </p>
            </div>
            <ArrowRight
              size={14}
              className="text-muted-foreground group-hover:translate-x-1 transition-transform"
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
