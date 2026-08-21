import type { Server, Socket } from "socket.io";

const onlineUsers = new Map();

const registerPresenceHandlers = (io: Server, socket: Socket) => {
    const { user } = socket;

    console.log(socket.id);

    onlineUsers.set(socket.id, {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
    });

    socket.on("get-online-friends", () => {
        const onlineFriendsRecords = Array.from(onlineUsers.values());

        socket.emit("online-friends", onlineFriendsRecords);
    });

    socket.on("disconnect", () => {
        onlineUsers.delete(socket.id);

        const onlineFriendsRecords = Array.from(onlineUsers.values());

        socket.emit("online-friends", onlineFriendsRecords);
    });
};

export default registerPresenceHandlers;
