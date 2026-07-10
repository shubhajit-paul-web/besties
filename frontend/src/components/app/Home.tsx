import Post from "../shared/Post";

const Home = () => {
	const postsDummyData = [
		{
			id: "a4v45403450",
			author: {
				id: "user123456",
				name: "Shubhajit Paul",
				avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
			},
			caption: "Knowledge Debt may become the next Technical Debt. Technical debt builds up when we take shortcuts in code. Knowledge debt builds up when we take shortcuts in learning",
			mediaUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 15000,
				comments: 2500,
				shares: 655,
			},
			isLiked: true,
			isSaved: false,
			isOwner: true,
			createdAt: "2026-07-09T18:30:00.000Z",
		},
		{
			id: "b9x87214590",
			author: {
				id: "user789012",
				name: "Sarah Jenkins",
				avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
			},
			caption: "Morning coffee and clearing out the sprint backlog. Nothing beats a clean git status to start the day. ☕✨",
			mediaUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 4120,
				comments: 184,
				shares: 42,
			},
			isLiked: false,
			isSaved: true,
			isOwner: false,
			createdAt: "2026-07-10T06:15:00.000Z",
		},
		{
			id: "c2m11983402",
			author: {
				id: "user456789",
				name: "Alex Rivera",
				avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop",
			},
			caption: "Chasing sunsets while working remotely this week. Decentralized teams mean your office can look like this.",
			// mediaUrl: "https://images.unsplash.com/photo-150752428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 9840,
				comments: 512,
				shares: 118,
			},
			isLiked: true,
			isSaved: true,
			isOwner: false,
			createdAt: "2026-07-10T12:00:00.000Z",
		},
		{
			id: "d5k33291048",
			author: {
				id: "user112233",
				name: "Elena Rostova",
				avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
			},
			caption: "Minimalist desk setup setup is complete. Matte finishes, neutral tones, and deep focus mode activated. Rate my setup out of 10!",
			mediaUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 12450,
				comments: 892,
				shares: 310,
			},
			isLiked: false,
			isSaved: false,
			isOwner: false,
			createdAt: "2026-07-10T14:45:00.000Z",
		},
		{
			id: "e7r44910238",
			author: {
				id: "user445566",
				name: "David Chen",
				avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
			},
			caption: "Just published a comprehensive guide on modern Redis caching strategies for distributed architectures. Link in bio! 🚀",
			mediaUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 3120,
				comments: 145,
				shares: 89,
			},
			isLiked: true,
			isSaved: false,
			isOwner: false,
			createdAt: "2026-07-10T09:30:00.000Z",
		},
		{
			id: "f1p88301942",
			author: {
				id: "user778899",
				name: "Aisha Rahman",
				avatarUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=150&auto=format&fit=crop",
			},
			caption: "Spent the evening sketching out a clean, dark-themed dashboard UI. Prioritizing layout rhythm and subtle shadows.",
			mediaUrl: "https://images.unsplash.com/photo-1581291518655-9523c932dedf?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 7540,
				comments: 421,
				shares: 195,
			},
			isLiked: false,
			isSaved: true,
			isOwner: false,
			createdAt: "2026-07-09T21:10:00.000Z",
		},
		{
			id: "g3w22948103",
			author: {
				id: "user990011",
				name: "Marcus Aurelius",
				avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
			},
			caption: "If you are distressed by anything external, the pain is not due to the thing itself, but to your estimate of it; and this you have the power to revoke at any moment.",
			mediaUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 22400,
				comments: 3410,
				shares: 8900,
			},
			isLiked: true,
			isSaved: true,
			isOwner: false,
			createdAt: "2026-07-08T05:00:00.000Z",
		},
		{
			id: "h8t55410923",
			author: {
				id: "user334455",
				name: "Chloe Vance",
				avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
			},
			caption: "Weekend wilderness hikes. Always remember to unplug and let your subconscious solve those complex architectural bugs for you.",
			mediaUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 5600,
				comments: 198,
				shares: 64,
			},
			isLiked: false,
			isSaved: false,
			isOwner: false,
			createdAt: "2026-07-05T16:20:00.000Z",
		},
		{
			id: "i0m66391045",
			author: {
				id: "user556677",
				name: "Vikram Malhotra",
				avatarUrl: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=150&auto=format&fit=crop",
			},
			caption: "Refactoring a massive legacy MongoDB codebase today. Indexes are your best friend, but compounding compound indexes can sneak up on you.",
			mediaUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 2890,
				comments: 94,
				shares: 37,
			},
			isLiked: true,
			isSaved: false,
			isOwner: false,
			createdAt: "2026-07-10T11:05:00.000Z",
		},
		{
			id: "j4q99201483",
			author: {
				id: "user123456",
				name: "Shubhajit Paul",
				avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
			},
			caption: "Building toolsets that optimize workflow friction isn't just about speed; it's about preserving cognitive load for the problems that actually matter.",
			mediaUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
			metrics: {
				likes: 18450,
				comments: 1205,
				shares: 932,
			},
			isLiked: true,
			isSaved: true,
			isOwner: true,
			createdAt: "2026-07-10T15:00:00.000Z",
		},
	];

	return (
		<div className="bg-slate-50 p-5 rounded-2xl flex flex-col items-center gap-5">
			{postsDummyData.map((post, index) => (
				<Post
					key={index}
					post={{
						id: post.id,
						author: {
							id: post.author.id,
							name: post.author.name,
							avatarUrl: post.author.avatarUrl || "/public/profile-img.jpeg",
						},
						caption: post.caption,
						mediaUrl: post.mediaUrl || "",
						metrics: {
							likes: post.metrics.likes,
							comments: post.metrics.comments,
							shares: post.metrics.shares,
						},
						isLiked: post.isLiked,
						isSaved: post.isSaved,
						isOwner: post.isOwner,
						createdAt: post.createdAt || "2026-07-09T18:30:00.000Z",
					}}
				/>
			))}
		</div>
	);
};

export default Home;
