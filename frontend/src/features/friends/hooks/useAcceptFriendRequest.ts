import { acceptFriendRequestApi } from "../apis/friend.api";
import { mutate } from "swr";
import { toast } from "react-toastify";

const useAcceptFriendRequest = () => {
	const handleAcceptFriendRequest = async (friendshipId: string) => {
		try {
			await acceptFriendRequestApi(friendshipId);

			toast.success("Friend request accepted successfully", {
				position: "top-center",
			});

			mutate("/friends/requests/received");
		} catch (err) {
			toast.error("Friend request accepted faild", {
				position: "top-center",
			});

			console.error(err);
		}
	};

	return { handleAcceptFriendRequest };
};

export default useAcceptFriendRequest;
