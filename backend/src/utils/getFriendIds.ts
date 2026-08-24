import { Types } from "mongoose";
import { FriendDocument } from "../models/friend.model.js";

type Friendship = FriendDocument & {
    _id: Types.ObjectId;
};

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
