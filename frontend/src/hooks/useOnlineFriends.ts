import socket from "@/lib/socket";
import { useEffect } from "react";

const useOnlineFriends = () => {
	const handleOnlineFriends = (friends: string) => {
		console.log(friends);
	};

	useEffect(() => {
		socket.connect();

		socket.emit("get-online-friends");

		socket.on("online-friends", handleOnlineFriends);

		return () => {
			socket.off("online-friends", handleOnlineFriends);
		};
	}, []);

	return;
};

export default useOnlineFriends;
