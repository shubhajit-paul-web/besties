import socket from "@/lib/socket";
import { useEffect, useState } from "react";
import useCurrentUser from "./useCurrentUser";
import type { AccessTokenPayload } from "@/types/user.types";

const useOnlineFriends = () => {
	const { user: currentUser } = useCurrentUser();
	const [onlineFriends, setOnlineFriends] = useState<AccessTokenPayload[]>([]);

	const handleOnlineFriends = (friends: AccessTokenPayload[]) => {
		setOnlineFriends(friends.filter((user) => user?._id !== currentUser?._id));
	};

	useEffect(() => {
		console.log(currentUser);

		socket.connect();

		// socket.emit("get-online-friends");

		socket.on("get-online-friends", handleOnlineFriends);

		return () => {
			socket.off("get-online-friends", handleOnlineFriends);
		};
	}, []);

	return onlineFriends;
};

export default useOnlineFriends;
