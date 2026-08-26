const ChatHeaderSkeleton = () => {
	return (
		<header className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-5 py-4" aria-label="Loading chat header">
			<div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-slate-200" />
			<div className="min-w-0 flex-1 space-y-2">
				<div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
				<div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
			</div>
		</header>
	);
};

export default ChatHeaderSkeleton;
