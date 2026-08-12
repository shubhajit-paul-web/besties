import FriendModel, { type FriendDocument } from "../models/friend.model.js";
import type { FindFriendshipsByStatus } from "../types/friend/friend.repository.js";
import type { QueryFilter } from "mongoose";

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

const findFriendshipByIdAndReceiver = async (friendshipId: string, receiverId: string) => {
    return FriendModel.findOne({
        _id: friendshipId,
        receiver: receiverId,
    })
        .select("-createdAt -updatedAt")
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

export default {
    create,
    hasPendingFriendRequest,
    findFriendshipsByStatus,
    updateStatusById,
    findFriendshipById,
    findFriendshipByIdAndReceiver,
    findSentFriendRequestsByStatus,
    findPendingRequestsByReceiver,
};
