import useSWR from "swr";
import { MessageCircle, PanelLeftOpen, PanelRightOpen, Phone, Video } from "lucide-react";
import { useLocation, useParams } from "react-router-dom";
import { Tooltip } from "antd";
import Avatar from "@/components/ui/Avatar";
import fetcher from "@/utils/fetcher";
import formatUserName from "@/utils/formatUserName";
import useOnlineFriendsContext from "@/hooks/useOnlineFriendsContext";

type SessionConfig = {
	label: string;
	Icon: typeof MessageCircle;
};

type FriendProfile = {
	_id?: string;
	name?: {
		first: string;
		last?: string;
	};
	avatar?: string;
};

type ActiveSessionHeaderProps = {
	isLeftSidebarOpen: boolean;
	setIsLeftSidebarOpen: (isOpen: boolean) => void;
};

const SESSION_CONFIG: Record<string, SessionConfig> = {
	"/app/chat": { label: "Chat", Icon: MessageCircle },
	"/app/audio-call": { label: "Audio call", Icon: Phone },
	"/app/video-call": { label: "Video call", Icon: Video },
};

const ActiveSessionHeader = ({ isLeftSidebarOpen, setIsLeftSidebarOpen }: ActiveSessionHeaderProps) => {
	const { pathname } = useLocation();
	const { friendId } = useParams<{ friendId: string }>();
	const { onlineFriends } = useOnlineFriendsContext();
	const sessionKey = Object.keys(SESSION_CONFIG).find((key) => pathname.startsWith(`${key}/`));
	const session = sessionKey ? SESSION_CONFIG[sessionKey] : null;
	const { data: friendResponse, isLoading } = useSWR<{ data?: FriendProfile }>(friendId ? `/users/${friendId}` : null, fetcher, {
		revalidateOnFocus: false,
	});

	if (!session) return null;

	const friend = friendResponse?.data;
	const isFriendOnline = Boolean(friend?._id && onlineFriends.some((onlineFriend) => onlineFriend?._id === friend._id));
	const { Icon } = session;

	return (
		<header className="mb-3 flex min-h-16 items-center justify-between gap-4 border-b border-slate-200/70 bg-white px-2 py-2.5 sm:px-3">
			<div className="flex min-w-0 items-center gap-2 sm:gap-3">
				<Tooltip placement="bottom" title={isLeftSidebarOpen ? "Collapse sidebar" : "Expand sidebar"} mouseLeaveDelay={0}>
					<button
						type="button"
						aria-label={isLeftSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
						className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-slate-100 text-slate-700 transition-colors hover:bg-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2"
						onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}>
						{isLeftSidebarOpen ? <PanelRightOpen size={18} /> : <PanelLeftOpen size={18} />}
					</button>
				</Tooltip>
				<div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-700">
					<Icon size={19} strokeWidth={2} aria-hidden="true" />
				</div>
				<div className="min-w-0">
					<p className="text-sm font-semibold text-slate-900">{session.label}</p>
					<p className="truncate text-xs text-slate-500">{isLoading ? "Loading friend..." : friend?.name ? `With ${formatUserName(friend.name)}` : "Active session"}</p>
				</div>
			</div>

			{friend && (
				<div className="flex min-w-0 items-center gap-2.5">
					<div className="relative shrink-0">
						<Avatar image={friend.avatar || "/profile-img.jpeg"} defaultAvatar="/profile-img.jpeg" imageSize={36} />
						<span
							className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white ${isFriendOnline ? "bg-emerald-500" : "bg-slate-300"}`}
							aria-label={isFriendOnline ? "Online" : "Offline"}
						/>
					</div>
					<span className="hidden max-w-32 truncate text-sm font-medium text-slate-700 sm:block">{formatUserName(friend.name)}</span>
				</div>
			)}
		</header>
	);
};

export default ActiveSessionHeader;
