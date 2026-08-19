import FriendRequests from "../components/FriendRequests";
import MyFriends from "../components/MyFriends";

const Friends = () => {
	return (
		<div className="w-full rounded-xl bg-slate-50 p-4 pt-5 sm:rounded-2xl sm:p-6 sm:pt-6 lg:p-8">
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
