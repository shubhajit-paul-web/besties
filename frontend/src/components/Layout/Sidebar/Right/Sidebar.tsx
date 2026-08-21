import getPathName from "@/utils/getPathName";
import FriendSuggestions from "./FriendSuggestions";
import OnlineFriends from "./OnlineFriends";
import { useLocation } from "react-router-dom";

const RightSidebar = ({ rightSidebarWidth }: { rightSidebarWidth: number }) => {
	const { pathname } = useLocation();

	const path = getPathName(pathname);

	return (
		<aside className="hidden xl:block h-screen p-8 fixed top-0 right-0" style={{ width: rightSidebarWidth + "px" }}>
			<div className="h-full bg-slate-50 border-l border-slate-100 rounded-xl py-5 px-5 flex flex-col gap-4">
				{/* Friend suggestions */}
				{path === "chat" || <FriendSuggestions />}

				{/* My friends */}
				{path === "chat" ? <OnlineFriends height="100%" /> : <OnlineFriends />}
			</div>
		</aside>
	);
};

export default RightSidebar;
