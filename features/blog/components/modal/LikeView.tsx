"use client";

import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { usePostLikes } from "../../hooks/usePostLikes";
import { InfiniteScrollTrigger } from "../InfiniteScrollTrigger";

type Props = {
	postId: number;
};

function LikeView({ postId }: Props) {
	const {
		data: infiniteLikes,
		isLoading: likesLoading,
		error: likesError,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	} = usePostLikes({ postId });

	const likes = infiniteLikes?.pages.flatMap((page) => page.users) || [];
	const totalLikes = infiniteLikes?.pages[0]?.total || 0;

	if (likesLoading) {
		return (
			<div className="flex flex-col h-[50vh]">
        <div className="flex-1 overflow-y-auto px-8 py-4 no-scrollbar">
          <div className="flex flex-col">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-4 border-b border-border/10 last:border-0">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col gap-1.5">
                    <Skeleton className="h-4 w-[120px] rounded" />
                    <Skeleton className="h-3 w-[160px] rounded" />
                  </div>
                </div>
                <Skeleton className="h-8 w-14 rounded-full" />
              </div>
            ))}
          </div>
        </div>
			</div>
		);
	}

	if (likesError) {
		return (
			<div className="p-4 text-center text-sm text-red-500">
				Error loading likes. Please try again.
			</div>
		);
	}

	if (likes.length === 0) {
		return (
			<div className="py-8 text-center text-sm text-muted-foreground">
				No likes yet. Be the first to like this post!
			</div>
		);
	}

	return (
		<div className="flex flex-col h-[50vh]">
			<div className="flex-1 overflow-y-auto px-8 py-4 no-scrollbar">
        <div className="flex flex-col">
          {likes.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-4 py-4 border-b border-border/10 last:border-0 group"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 ring-1 ring-border shadow-sm">
                  <AvatarImage src={user.image || undefined} alt={user.name} />
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-black">
                    {user.name?.charAt(0).toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-foreground">
                    {user.name}
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    {user.email}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="rounded-full px-4 h-8 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/5 hover:text-primary"
              >
                View
              </Button>
            </div>
          ))}
          <InfiniteScrollTrigger
            onIntersect={() => fetchNextPage()}
            isEnabled={!!hasNextPage}
            isFetching={isFetchingNextPage}
          />
        </div>
			</div>
		</div>
	);
}

export default LikeView;
