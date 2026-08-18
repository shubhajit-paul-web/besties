import { mutate } from "swr";
import { rejectFriendRequestApi } from "../apis/friend.api";
import { toast } from "react-toastify";

const useRejectFriendRequest = () => {
	const handleRejectFriendRequest = async (friendshipId: string) => {
		try {
			await rejectFriendRequestApi(friendshipId);

			toast.success("Friend request rejected successfully", {
				position: "top-center",
			});

			mutate("/friends/requests/received");
		} catch (err) {
			toast.error("Friend request rejected faild", {
				position: "top-center",
			});

			console.error(err);
		}
	};

	return { handleRejectFriendRequest };
};

export default useRejectFriendRequest;
