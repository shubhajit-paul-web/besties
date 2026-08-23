import type { Socket } from "socket.io";
import { AccessTokenPayload } from "../../types/auth/auth.jwt.js";
import friendRepository from "../../repositories/friend.repository.js";
import getFriendIds from "../../utils/getFriendIds.js";
import { Types } from "mongoose";

const onlineUsers = new Map<string, AccessTokenPayload>();
const userSockets = new Map<string, Socket>();

const fetchFriendIds = async (currentUserId: string) => {
    const friendships = await friendRepository.findFriendshipsByStatus({
        currentUserId,
        status: "accepted",
        fields: "sender receiver",
    });

    return getFriendIds(currentUserId, friendships);
};

const getOnlineFriends = (friendIds: Types.ObjectId[]) => {
    return friendIds.map((id) => onlineUsers.get(String(id))).filter(Boolean);
};

const emitOnlineFriends = async (userId: string) => {
    const friendIds = await fetchFriendIds(userId);
    const socket = userSockets.get(userId);

    if (socket) {
        if (!friendIds || friendIds.length === 0) {
            return socket.emit("friends:online-updated", []);
        }

        socket.emit("friends:online-updated", getOnlineFriends(friendIds));
    }

    for (const friendId of friendIds) {
        const friendSocket = userSockets.get(String(friendId));

        if (friendSocket) {
            const friendsOfFriendIds = await fetchFriendIds(String(friendId));

            friendSocket.emit("friends:online-updated", getOnlineFriends(friendsOfFriendIds));
        }
    }
};

const registerPresenceHandlers = async (socket: Socket) => {
    const { user } = socket;
    const userId = String(user._id);

    onlineUsers.set(userId, {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
    });
    userSockets.set(userId, socket);

    await emitOnlineFriends(userId);

    socket.on("disconnect", async () => {
        onlineUsers.delete(userId);
        userSockets.delete(userId);

        await emitOnlineFriends(userId);
    });
};

export default registerPresenceHandlers;
