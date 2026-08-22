import { lazy } from "react";
import { useLocation } from "react-router-dom";
import getPathName from "@/utils/getPathName";
const FriendSuggestions = lazy(() => import("./FriendSuggestions"));
const OnlineFriends = lazy(() => import("./OnlineFriends"));

const RightSidebar = ({ rightSidebarWidth }: { rightSidebarWidth: number }) => {
	const { pathname } = useLocation();

	const path = getPathName(pathname);
	const isChatPage = path.startsWith("chat/");

	return (
		<aside className="hidden xl:block h-screen p-8 fixed top-0 right-0" style={{ width: rightSidebarWidth + "px" }}>
			<div className="h-full bg-slate-50 border-l border-slate-100 rounded-xl py-5 px-5 flex flex-col gap-4">
				{/* Friend suggestions */}
				{isChatPage || <FriendSuggestions />}

				{/* My friends */}
				{isChatPage ? <OnlineFriends height="100%" /> : <OnlineFriends />}
			</div>
		</aside>
	);
};

export default RightSidebar;
