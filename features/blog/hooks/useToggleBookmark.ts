import {
	type InfiniteData,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleBookmarkAction } from "../actions";
import type { PostListItemsT, PostListResponse } from "../types";
import { postKeys } from "../utils/postKey";

export const useToggleBookmark = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (postId: string | number) => {
			const response = await toggleBookmarkAction(Number(postId));
			if (!response.success) {
				throw new Error(response.message);
			}
			return response;
		},
		onMutate: async (postId) => {
			const idStr = postId.toString();
			const numericId = Number(postId);

			await queryClient.cancelQueries({ queryKey: postKeys.all });
			await queryClient.cancelQueries({ queryKey: ["post", idStr] });

			const previousPostsPages = queryClient.getQueriesData<
				InfiniteData<{ data: PostListResponse }>
			>({
				queryKey: postKeys.all,
			});
			const previousSinglePost = queryClient.getQueryData<{
				data: PostListItemsT;
			}>(["post", idStr]);

			// Optimistically update lists
			queryClient.setQueriesData<InfiniteData<{ data: PostListResponse }>>(
				{ queryKey: postKeys.all },
				(old) => {
					if (!old) return old;
					return {
						...old,
						pages: old.pages.map((page) => ({
							...page,
							data: {
								...page.data,
								posts: page.data.posts.map((post) => {
									if (post.id === numericId) {
										return {
											...post,
											isBookmarked: !post.isBookmarked,
										};
									}
									return post;
								}),
							},
						})),
					};
				},
			);

			if (previousSinglePost) {
				queryClient.setQueryData<{ data: PostListItemsT }>(["post", idStr], {
					...previousSinglePost,
					data: {
						...previousSinglePost.data,
						isBookmarked: !previousSinglePost.data.isBookmarked,
					},
				});
			}

			return { previousPostsPages, previousSinglePost, idStr };
		},
		onSuccess: (response) => {
			if (response.data.bookmarked) {
				toast.success("Added to library");
			} else {
				toast.info("Removed from library");
			}
		},
		onError: (err, postId, context) => {
			if (context?.previousPostsPages) {
				context.previousPostsPages.forEach(([queryKey, data]) => {
					queryClient.setQueryData(queryKey, data);
				});
			}
			if (context?.previousSinglePost && context?.idStr) {
				queryClient.setQueryData(
					["post", context.idStr],
					context.previousSinglePost,
				);
			}

			const errorMessage = err instanceof Error ? err.message : "Failed to update bookmark";
			toast.error(errorMessage);
		},
		onSettled: (data, error, postId) => {
			const idStr = postId.toString();
			queryClient.invalidateQueries({ queryKey: ["post", idStr] });
      // Invalidate bookmark lists to ensure accuracy
      queryClient.invalidateQueries({ queryKey: [...postKeys.all, "bookmarks"] });
		},
	});
};
