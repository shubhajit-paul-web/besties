import type { AccessTokenPayload } from "../../types/auth/auth.jwt.js";
import type { Server } from "socket.io";
import friendRepository from "../../repositories/friend.repository.js";
import filterFriendIds from "../../utils/getFriendIds.js";

const onlineUsers = new Map<string, AccessTokenPayload>();
const userSockets = new Map<string, string>();

const getOnlineFriendUsers = (friendIds: string[]) => {
    if (friendIds.length === 0) {
        return [];
    }

    return friendIds.map((id) => onlineUsers.get(String(id))).filter((user) => user !== undefined);
};

const getFriendIds = async (currentUserId: string) => {
    const friendships = await friendRepository.findFriendshipsByStatus({
        currentUserId,
        status: "accepted",
        fields: "sender receiver",
    });

    if (friendships.length === 0) {
        return [];
    }

    const friendIds = filterFriendIds(currentUserId, friendships);

    return friendIds;
};

const setOnline = (socketId: string, user: AccessTokenPayload) => {
    const userId = String(user._id);

    onlineUsers.set(userId, {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        name: user.name,
    });
    userSockets.set(userId, socketId);
};

const setOffline = (userId: string) => {
    onlineUsers.delete(userId);
    userSockets.delete(userId);
};

const emitOnlineFriends = async (io: Server, userId: string) => {
    const socketId = userSockets.get(userId);

    if (!socketId) {
        return;
    }

    const friendIds = await getFriendIds(userId);
    const onlineFriends = getOnlineFriendUsers(friendIds);

    io.to(socketId).emit("friends:online-updated", onlineFriends);

    if (onlineFriends.length === 0) {
        return;
    }

    const onlineFriendIds = onlineFriends.map((friend) => friend?._id).filter(Boolean);

    const friendshipsOfFriends =
        await friendRepository.findAcceptedFriendshipsByUserIds(onlineFriendIds);

    const friendshipMap = new Map<string, AccessTokenPayload[]>();

    for (const friendId of onlineFriendIds) {
        if (!friendId) continue;

        const friendIdString = String(friendId);

        const friendsOfFriendsIds = filterFriendIds(friendIdString, friendshipsOfFriends);
        const onlineFriendsOfFriends = getOnlineFriendUsers(friendsOfFriendsIds);

        friendshipMap.set(friendIdString, onlineFriendsOfFriends);
    }

    for (const friend of onlineFriends) {
        const friendId = String(friend?._id);
        const friendSocketId = userSockets.get(String(friendId));

        if (friendSocketId) {
            if (friendshipMap.has(friendId)) {
                const onlineFriends = friendshipMap.get(friendId) ?? [];

                io.to(friendSocketId).emit("friends:online-updated", onlineFriends);
            }
        }
    }
};

export default {
    setOnline,
    setOffline,
    emitOnlineFriends,
};
