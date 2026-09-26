import { Types } from "mongoose";
import { FriendDocument } from "../models/friend.model.js";

type Friendship = FriendDocument & {
    _id: Types.ObjectId;
};

/**
 * Gets the IDs of all friends connected to the current user.
 *
 * @param currentUserId - The ID of the current user.
 * @param friendships - The user's friendship records.
 * @returns A list of unique friend IDs.
 */
const getFriendIds = (currentUserId: string, friendships: Friendship[]) => {
    if (friendships.length === 0) {
        return [];
    }

    const friendIds = new Set<string>();

    for (const { sender, receiver } of friendships) {
        const senderId = String(sender);
        const receiverId = String(receiver);

        if (senderId === currentUserId) {
            friendIds.add(receiverId);
        } else if (receiverId === currentUserId) {
            friendIds.add(senderId);
        }
    }

    return Array.from(friendIds);
};

export default getFriendIds;
