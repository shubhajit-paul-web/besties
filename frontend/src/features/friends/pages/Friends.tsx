import FriendRequests from "../components/FriendRequests";
import MyFriends from "../components/MyFriends";

const Friends = () => {
	return (
		<div className="bg-slate-50 p-8 pt-6 rounded-2xl w-full">
			{/* Friend requests list */}
			<FriendRequests />

			{/* Friend suggestions list */}
			{/* <FriendSuggestions /> */}

			{/* <div className="w-full border-b-2 border-b-slate-300/70 my-12"></div> */}

			{/* My friends list */}
			<MyFriends />
		</div>
	);
};

export default Friends;
