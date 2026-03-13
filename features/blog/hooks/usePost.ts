import { useQuery } from "@tanstack/react-query";
import { postService } from "@/features/blog";

export const usePost = (id: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["post", id],
		queryFn: () => postService.getPost(id),
		refetchOnMount: "always",
	});

	return { data, isLoading, error };
};
