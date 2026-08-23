import type { AccessTokenPayload } from "../../types/auth/auth.jwt.js";
import type { Server } from "socket.io";
import friendRepository from "../../repositories/friend.repository.js";
import getFriendIds from "../../utils/getFriendIds.js";

const onlineUsers = new Map<string, AccessTokenPayload>();
const userSockets = new Map<string, string>();

// const getOnlineFriendUsers = (friendIds: Types.ObjectId[]) => {
//     if (friendIds.length === 0) {
//         return [];
//     }

//     return friendIds.map((id) => onlineUsers.get(String(id))).filter(Boolean);
// };

const getOnlineFriendUsers = async (currentUserId: string) => {
    const friendships = await friendRepository.findFriendshipsByStatus({
        currentUserId,
        status: "accepted",
        fields: "sender receiver",
    });

    if (friendships.length === 0) {
        return {
            friendIds: [],
            onlineFriends: [],
        };
    }

    const friendIds = getFriendIds(currentUserId, friendships);
    const onlineFriends = friendIds.map((id) => onlineUsers.get(String(id))).filter(Boolean);

    return { friendIds, onlineFriends };
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

// const emitOnlineFriends = async (io: Server, userId: string) => {
//     const friendIds = await getFriendIdsForUser(userId);
//     const socketId = userSockets.get(userId);

//     if (socketId) {
//         io.to(socketId).emit("friends:online-updated", getOnlineFriendUsers(friendIds));
//     }

//     return friendIds;
// };

const emitOnlineFriends = async (io: Server, userId: string) => {
    const socketId = userSockets.get(userId);

    if (!socketId) {
        return;
    }

    const { friendIds, onlineFriends } = await getOnlineFriendUsers(userId);

    io.to(socketId).emit("friends:online-updated", onlineFriends);

    for (const friendId of friendIds) {
        const friendSocketId = userSockets.get(String(friendId));

        if (friendSocketId) {
            const { onlineFriends } = await getOnlineFriendUsers(String(friendId));

            io.to(friendSocketId).emit("friends:online-updated", onlineFriends);
        }
    }
};

export default {
    setOnline,
    setOffline,
    emitOnlineFriends,
};
