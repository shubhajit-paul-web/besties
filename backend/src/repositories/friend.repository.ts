import FriendModel from "../models/friend.model.js";

const create = async (senderId: string, receiverId: string) => {
    return FriendModel.create({
        sender: senderId,
        receiver: receiverId,
    });
};

const hasPendingFriendRequest = async (senderId: string, receiverId: string) => {
    return FriendModel.exists({
        sender: receiverId,
        receiver: senderId,
        status: "pending",
    });
};

const findAcceptedFriendships = async (userId: string, fields: string = "sender receiver -_id") => {
    return FriendModel.find({
        $or: [{ sender: userId }, { receiver: userId }],
        status: "accepted",
    })
        .select(fields)
        .lean();
};

export default { create, hasPendingFriendRequest, findAcceptedFriendships };
