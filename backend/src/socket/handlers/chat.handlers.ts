import type { Server, Socket } from "socket.io";
import type { MessagePayload } from "../types/socket.types.js";

const registerChatHandlers = async (io: Server, socket: Socket) => {
    const roomId = `user:${String(socket.user._id)}`;

    await socket.join(roomId);

    socket.on("message", (payload: MessagePayload) => {
        io.to(`user:${payload.to}`).emit("message", {
            from: payload.from,
            message: payload.message,
        });
    });
};

export default registerChatHandlers;
