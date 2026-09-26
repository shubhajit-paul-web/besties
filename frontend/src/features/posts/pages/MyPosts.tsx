import fetcher from "@/utils/fetcher";
import useSWR from "swr";
import useCurrentUser from "@/hooks/useCurrentUser";
import Post from "@/components/ui/Post";
import type { Post as PostType } from "@/types/post.types";

const MyPosts = () => {
	const { isLoading: isCurrentUserLoading, user } = useCurrentUser();
	const { isLoading: isPostsLoading, data: postsRes } = useSWR("/posts/me", fetcher);

	if (isCurrentUserLoading || isPostsLoading) {
		return null;
	}

	const posts: PostType[] = postsRes?.data ?? [];

	console.log(posts);

	return (
		<div className="bg-slate-50 p-5 rounded-2xl flex flex-col items-center gap-5">
			{posts.map((post) => (
				<Post key={post._id} post={post} currentUserId={user?._id as string} />
			))}
		</div>
	);
};

export default MyPosts;
