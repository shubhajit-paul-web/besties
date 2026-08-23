import socket from "@/lib/socket";
import { useEffect, useState } from "react";
import useCurrentUser from "./useCurrentUser";
import type { AccessTokenPayload } from "@/types/user.types";

const useOnlineFriends = () => {
	const { user: currentUser } = useCurrentUser();
	const [onlineFriends, setOnlineFriends] = useState<AccessTokenPayload[]>([]);

	const handleUpdatedOnlineFriends = (friends: AccessTokenPayload[]) => {
		setOnlineFriends(friends.filter((user) => user?._id !== currentUser?._id));
	};

	useEffect(() => {
		socket.connect();

		socket.on("friends:online-updated", handleUpdatedOnlineFriends);

		return () => {
			socket.off("friends:online-updated", handleUpdatedOnlineFriends);
		};
	}, []);

	return onlineFriends;
};

export default useOnlineFriends;
