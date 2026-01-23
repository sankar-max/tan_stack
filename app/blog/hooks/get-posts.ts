import { useQuery } from "@tanstack/react-query";
import { getPublicPosts } from "../_actions";
import { postKeys } from "../lib/post-key";
type getPublishPost = Awaited<ReturnType<typeof getPublicPosts>>
export const usePublicPosts = () => {
 const { data, isLoading, error } = useQuery<getPublishPost>({
  queryKey: postKeys.publicLatest(12),
  queryFn: () => getPublicPosts(12),
  staleTime: 1000 * 60 * 5, // 5 min – adjust as needed
 });

 return { data, isLoading, error };
};