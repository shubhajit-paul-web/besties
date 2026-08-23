import { Types } from "mongoose";
import { FriendDocument } from "../models/friend.model.js";

type Friendship = FriendDocument & {
    _id: Types.ObjectId;
};

const getFriendRelations = (currentUserId: string, friendships: Friendship[]) => {
    const friends = friendships.map((friendship) => {
        const { sender, receiver } = friendship;

        if (String(sender) === currentUserId) {
            return {
                friendshipId: friendship._id,
                friendId: receiver,
            };
        }

        return {
            friendshipId: friendship._id,
            friendId: sender,
        };
    });

    return friends;
};

export default getFriendRelations;
