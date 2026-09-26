import type { AccessTokenPayload } from "../../types/auth/auth.jwt.js";
import type { Server } from "socket.io";
import type { PresenceUser } from "../types/socket.types.js";
import friendRepository from "../../repositories/friend.repository.js";
import filterFriendIds from "../../utils/getFriendIds.js";

/* 
  Keep a lightweight version of the user profile in memory for presence tracking
  we intentionally avoid storing the full auth payload here to keep the state small
  and only expose the data that is needed by the client for presence updates.
*/

// Keep only the users who are currently online in memory.
const onlineUsers = new Map<string, PresenceUser>();

// Return only the friends who are actually online.
const getOnlineFriendUsers = (friendIds: string[]) => {
    if (friendIds.length === 0) {
        return [] as PresenceUser[];
    }

    return friendIds
        .map((friendId) => onlineUsers.get(String(friendId)))
        .filter((user): user is PresenceUser => Boolean(user));
};

// Load the accepted friends of a user from the database.
const getAcceptedFriendIdsForUser = async (currentUserId: string) => {
    const friendships = await friendRepository.findFriendshipsByStatus({
        currentUserId,
        status: "accepted",
        fields: "sender receiver",
    });

    if (friendships.length === 0) {
        return [];
    }

    return filterFriendIds(currentUserId, friendships);
};

// Save a user as online using a small profile object.
const setOnline = (user: AccessTokenPayload) => {
    const normalizedUserId = String(user._id);

    onlineUsers.set(normalizedUserId, {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || null,
        name: user.name,
    });
};

// Remove the user from the online list when they disconnect.
const setOffline = (userId: string) => {
    onlineUsers.delete(userId);
};

// Send the current online friends list to the user and to their online friends.
const emitOnlineFriends = async (io: Server, userId: string) => {
    const normalizedUserId = String(userId);
    const acceptedFriendIds = await getAcceptedFriendIdsForUser(normalizedUserId);
    const onlineFriends = getOnlineFriendUsers(acceptedFriendIds);

    // Tell the current user which friends are online right now.
    io.to(`user:${normalizedUserId}`).emit("friends:online-updated", onlineFriends);

    if (onlineFriends.length === 0) return;

    const onlineFriendIds = new Set<string>();

    for (const friend of onlineFriends) {
        if (friend) {
            onlineFriendIds.add(String(friend._id));
        }
    }

    // Build a list of each online friend's friends so they can also see who is online.
    const friendshipsOfFriends = await friendRepository.findAcceptedFriendshipsByUserIds(
        Array.from(onlineFriendIds),
    );
    const onlineFriendsByUser = new Map<string, PresenceUser[]>();

    for (const onlineFriendId of onlineFriendIds) {
        const relatedFriendIds = filterFriendIds(String(onlineFriendId), friendshipsOfFriends);
        onlineFriendsByUser.set(onlineFriendId, getOnlineFriendUsers(relatedFriendIds));
    }

    // Share the updated presence list with each friend.
    for (const onlineFriend of onlineFriends) {
        const friendId = String(onlineFriend._id);

        const presenceSnapshot = onlineFriendsByUser.get(friendId) ?? [];
        io.to(`user:${friendId}`).emit("friends:online-updated", presenceSnapshot);
    }
};

export default {
    setOnline,
    setOffline,
    emitOnlineFriends,
};
