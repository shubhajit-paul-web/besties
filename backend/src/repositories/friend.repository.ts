import FriendModel, { type FriendDocument } from "../models/friend.model.js";
import type { FindFriendshipsByStatus } from "../types/friend/friend.repository.js";
import type { QueryFilter, Types } from "mongoose";

const create = async (senderId: string, receiverId: string) => {
    return FriendModel.create({
        sender: senderId,
        receiver: receiverId,
    });
};

const findFriendshipBetween = async (
    senderId: string,
    receiverId: string,
    fields: string = "status",
) => {
    return FriendModel.findOne({
        sender: receiverId,
        receiver: senderId,
    })
        .select(fields)
        .lean();
};

const deleteFriendshipByIdAndStatus = async (
    friendshipId: string | Types.ObjectId,
    status: FriendDocument["status"],
) => {
    return FriendModel.deleteOne({
        _id: friendshipId,
        status,
    });
};

const findFriendshipsByStatus = async ({
    currentUserId,
    status,
    fields = "sender receiver -_id",
}: FindFriendshipsByStatus) => {
    const filter: QueryFilter<FriendDocument> = {
        $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    };

    if (status) {
        filter.status = status;
    }

    return FriendModel.find(filter).select(fields).lean();
};

const updateStatusById = async (friendshipId: string, status: FriendDocument["status"]) => {
    return FriendModel.updateOne(
        {
            _id: friendshipId,
        },
        {
            $set: { status },
        },
    );
};

const findFriendshipById = async (
    friendshipId: string,
    fields: string = "-createdAt -updatedAt",
) => {
    return FriendModel.findById(friendshipId).select(fields).lean();
};

const findFriendshipByIdAndReceiver = async (
    friendshipId: string,
    receiverId: string,
    fields: string = "-createdAt -updatedAt",
) => {
    return FriendModel.findOne({
        _id: friendshipId,
        receiver: receiverId,
    })
        .select(fields)
        .lean();
};

const findSentFriendRequestsByStatus = async (userId: string, status: FriendDocument["status"]) => {
    return FriendModel.find({
        sender: userId,
        status,
    })
        .populate("receiver", "username name avatar")
        .lean();
};

const findPendingRequestsByReceiver = async (userId: string) => {
    return FriendModel.find({
        receiver: userId,
        status: "pending",
    })
        .populate("sender", "username name avatar")
        .select("sender createdAt")
        .lean();
};

const deleteFriendship = async (userId: string, friendshipId: string) => {
    return FriendModel.deleteOne({
        _id: friendshipId,
        $or: [{ sender: userId }, { receiver: userId }],
        status: "accepted",
    });
};

export default {
    create,
    findFriendshipBetween,
    deleteFriendshipByIdAndStatus,
    findFriendshipsByStatus,
    updateStatusById,
    findFriendshipById,
    findFriendshipByIdAndReceiver,
    findSentFriendRequestsByStatus,
    findPendingRequestsByReceiver,
    deleteFriendship,
};
