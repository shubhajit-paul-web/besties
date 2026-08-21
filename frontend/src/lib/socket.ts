import { io } from "socket.io-client";
import env from "@/config/env";

const socket = io(env.API_URL, {
	autoConnect: false,
	withCredentials: true,
});

export default socket;
