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

	const likes = infiniteLikes?.pages.flatMap((page) => page.data.users) || [];
	const totalLikes = infiniteLikes?.pages[0]?.data.total || 0;

	if (likesLoading) {
		return (
			<div className="flex flex-col gap-3">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="flex items-center gap-3">
						<Skeleton className="h-10 w-10 rounded-full" />
						<div className="flex flex-col gap-2">
							<Skeleton className="h-4 w-[150px]" />
							<Skeleton className="h-3 w-[100px]" />
						</div>
					</div>
				))}
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
		<div className="flex flex-col gap-4">
			<div className="text-sm font-medium text-muted-foreground">
				{totalLikes} {totalLikes === 1 ? "person" : "people"} liked this
			</div>
			<ScrollArea className="h-[300px] pr-4">
				<div className="flex flex-col ">
					{likes.map((user) => (
						<div
							key={user.id}
							className="flex items-start gap-3 hover:bg-muted/50 p-2 rounded-md group justify-between"
						>
							<div className="flex items-center gap-3">
								<Avatar>
									<AvatarImage src={user.image || undefined} alt={user.name} />
									<AvatarFallback>
										{user.name?.charAt(0).toUpperCase() || "?"}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col">
									<span className="text-sm font-medium">{user.name}</span>
									<span className="text-xs text-muted-foreground">
										{user.email}
									</span>
								</div>
							</div>
							<Button
								size={"sm"}
								className="opacity-0 group-hover:opacity-100 transition-opacity"
								variant={"ghost"}
							>
								<Eye />
							</Button>
						</div>
					))}
					<InfiniteScrollTrigger
						onIntersect={() => fetchNextPage()}
						isEnabled={!!hasNextPage}
						isFetching={isFetchingNextPage}
					/>
				</div>
			</ScrollArea>
		</div>
	);
}

export default LikeView;
