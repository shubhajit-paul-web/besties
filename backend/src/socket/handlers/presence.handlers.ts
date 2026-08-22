import type { Server, Socket } from "socket.io";

const onlineUsers = new Map();

const registerPresenceHandlers = (io: Server, socket: Socket) => {
    const { user } = socket;

    onlineUsers.set(socket.id, {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
    });

    const onlineFriendsRecords = Array.from(onlineUsers.values());

    io.emit("get-online-friends", onlineFriendsRecords);

    // socket.on("get-online-friends", () => {
    //     io.emit("online-friends", onlineFriendsRecords);
    // });

    socket.on("disconnect", () => {
        onlineUsers.delete(socket.id);

        const onlineFriendsRecords = Array.from(onlineUsers.values());

        io.emit("get-online-friends", onlineFriendsRecords);
    });
};

export default registerPresenceHandlers;
