import { Types } from "mongoose";
import { FriendDocument } from "../models/friend.model.js";

type Friendship = FriendDocument & {
    _id: Types.ObjectId;
};

const getFriendIds = (currentUserId: string, friendships: Friendship[]) => {
    if (friendships.length === 0) {
        return [];
    }

    return friendships.map((friendship) => {
        const { sender, receiver } = friendship;

        if (String(sender) === currentUserId) {
            return receiver;
        }

        return sender;
    });
};

export default getFriendIds;
