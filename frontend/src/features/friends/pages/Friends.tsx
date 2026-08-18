import FriendRequests from "../components/FriendRequests";
import FriendSuggestions from "../components/FriendSuggestions";
import MyFriends from "../components/MyFriends";

const Friends = () => {
	return (
		<div>
			<div className="bg-slate-50 p-8 pt-6 rounded-2xl">
				{/* Friend requests list */}
				<FriendRequests />

				{/* Friend suggestions list */}
				<FriendSuggestions />

				<div className="w-full border-b-2 border-b-slate-300/70 my-12"></div>

				{/* My friends list */}
				<MyFriends />
			</div>
		</div>
	);
};

export default Friends;
