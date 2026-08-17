import Post from "../shared/Post";

const MyPosts = () => {
	return (
		<div className="bg-slate-50 p-5 rounded-2xl flex flex-col items-center gap-5">
			{Array(20)
				.fill(0)
				.map(() => (
					<Post
						post={{
							id: "a4v45403450",
							author: {
								id: "user123456",
								name: "Shubhajit Paul",
								avatarUrl: "/public/profile-img.jpeg",
							},
							caption:
								"Knowledge Debt may become the next Technical Debt. Technical debt builds up when we take shortcuts in code. Knowledge debt builds up when we take shortcuts in learning",
							mediaUrl: "https://cdnb.artstation.com/p/assets/images/images/079/205/017/large/sourav-ghosh-back-to-school-x-media-post-template-design-07.jpg?1724262273",
							metrics: {
								likes: 15000,
								comments: 2500,
								shares: 655,
							},
							isLiked: true,
							isSaved: false,
							isOwner: true,
							createdAt: "2026-07-09T18:30:00.000Z",
						}}
					/>
				))}
		</div>
	);
};

export default MyPosts;
