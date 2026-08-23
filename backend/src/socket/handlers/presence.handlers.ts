import type { Server, Socket } from "socket.io";

const onlineUsers = new Map();

const registerPresenceHandlers = (socket: Socket, io: Server) => {
    const { user } = socket;

    onlineUsers.set(socket.id, {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
    });

    io.emit("friends:online-updated", Array.from(onlineUsers.values()));

    socket.on("disconnect", () => {
        onlineUsers.delete(socket.id);

        io.emit("friends:online-updated", Array.from(onlineUsers.values()));
    });
};

export default registerPresenceHandlers;
