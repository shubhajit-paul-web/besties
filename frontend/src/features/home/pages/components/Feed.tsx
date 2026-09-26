/* eslint-disable @typescript-eslint/no-explicit-any */
import useFeed from "../../hooks/useFeed";
import useCurrentUser from "@/hooks/useCurrentUser";
import Post from "@/components/ui/Post";

const Feed = () => {
	const { isLoading: isCurrentUserLoading, data: currentUserRes } = useCurrentUser();
	const { isLoading: isFeedLoading, data: feedRes } = useFeed();

	if (isFeedLoading || isCurrentUserLoading) {
		return null;
	}

	const currentUserId = currentUserRes.data?.user?._id;
	const feed = feedRes?.data ?? [];

	return (
		<div className="w-full bg-slate-50 rounded-2xl flex flex-col items-center gap-5">
			{feed.map((post: any, index: any) => (
				<Post
					key={index}
					post={post}
					currentUserId={currentUserId as string}
					// post={{
					// 	id: post._id,
					// 	author: {
					// 		id: post.user?._id,
					// 		name: formatUserName(post.user?.name),
					// 		avatarUrl: post.user?.avatarUrl || "/profile-img.jpeg",
					// 	},
					// 	content: post.content,
					// 	visibility: post.visibility,
					// 	files: post.files ?? [],
					// 	metrics: {
					// 		likes: post.metrics?.likes || 0,
					// 		comments: post.metrics?.comments || 0,
					// 		shares: post.metrics?.shares || 0,
					// 	},
					// 	isLiked: Boolean(post.isLiked),
					// 	isSaved: Boolean(post.isSaved),
					// 	isOwner: post.user._id === currentUserId,
					// 	createdAt: post.createdAt || "2026-07-09T18:30:00.000Z",
					// }}
				/>
			))}
		</div>
	);
};

export default Feed;
