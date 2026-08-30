import useAppContext from "./useAppContext";

const useOnlineFriendsContext = () => {
	const { onlineFriends = [], setOnlineFriends } = useAppContext();

	return {
		onlineFriends,
		setOnlineFriends,
	};
};

export default useOnlineFriendsContext;
