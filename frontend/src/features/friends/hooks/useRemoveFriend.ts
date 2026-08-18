import { toast } from "react-toastify";
import { removeFriendApi } from "../apis/friend.api";
import { mutate } from "swr";

const useRemoveFriend = () => {
	const handleRemoveFriend = async (friendshipId: string) => {
		try {
			await removeFriendApi(friendshipId);

			toast.success("Friend removed successfully", {
				position: "top-center",
			});

			mutate("/friends");
		} catch (err) {
			toast.error("Couldn’t remove friend. Please try again.", {
				position: "top-center",
			});

			console.error(err);
		}
	};

	return { handleRemoveFriend };
};

export default useRemoveFriend;
