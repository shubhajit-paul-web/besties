import Avatar from "@/components/ui/Avatar";
import ChatHeaderSkeleton from "./ChatHeaderSkeleton";
import formatUserName from "@/utils/formatUserName";

interface ChatHeaderProps {
	isLoading: boolean;
	name: {
		first: string;
		last?: string;
	};
	avatar: string;
	status?: string;
}

const ChatHeader = ({ isLoading, name, avatar, status = "Active now" }: ChatHeaderProps) => {
	if (isLoading) {
		return <ChatHeaderSkeleton />;
	}

	return (
		<header className="flex items-center gap-3 border-b border-slate-200/80 bg-white px-5 py-4">
			<div className="relative shrink-0">
				<Avatar image={avatar || "/profile-img.jpeg"} defaultAvatar="/profile-img.jpeg" imageSize={44} />
				<span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" aria-label="Online" />
			</div>
			<div className="min-w-0">
				<h1 className="truncate text-base font-semibold text-slate-900 capitalize">{formatUserName(name)}</h1>
				<div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
					<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
					<span>{status}</span>
				</div>
			</div>
		</header>
	);
};

export default ChatHeader;
