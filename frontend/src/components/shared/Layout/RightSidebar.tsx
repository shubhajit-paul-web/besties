import FriendSuggestions from "./FriendSuggestions";
import MyFriends from "./MyFriends";

const RightSidebar = ({ rightSidebarWidth }: { rightSidebarWidth: number }) => {
	return (
		<aside className={`w-[${rightSidebarWidth}px] h-screen p-8 fixed top-0 right-0`} style={{ width: rightSidebarWidth + "px" }}>
			<div className="h-full bg-slate-50 border-l border-slate-100 rounded-xl py-5 px-5 flex flex-col gap-4">
				{/* Friend suggestions */}
				<FriendSuggestions />

				{/* My friends */}
				<MyFriends />
			</div>
		</aside>
	);
};

export default RightSidebar;
