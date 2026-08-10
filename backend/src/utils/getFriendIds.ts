import { Types } from "mongoose";
import { FriendDocument } from "../models/friend.model.js";

type Friendship = FriendDocument & {
    _id: Types.ObjectId;
};

const getFriendIds = (currentUserId: string, friendships: Friendship[]): Types.ObjectId[] => {
    return friendships.map((friendship) => {
        if (String(friendship.sender) === currentUserId) {
            return friendship.receiver;
        }

        return friendship.sender;
    });
};

export default getFriendIds;
