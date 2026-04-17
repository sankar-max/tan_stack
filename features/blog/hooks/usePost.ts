import { useQuery } from "@tanstack/react-query";
import { getPostAction } from "../actions";

export const usePost = (id: string) => {
	const { data, isLoading, error } = useQuery({
		queryKey: ["post", id],
		queryFn: async () => {
			const result = await getPostAction(id);
			if (!result.success) throw new Error(result.message);
			return result.data;
		},
		refetchOnMount: "always",
	});

	return { data, isLoading, error };
};
