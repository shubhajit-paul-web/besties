/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import friendRepository from "../repositories/friend.repository.js";
import isDuplicateKeyError from "../utils/isDuplicateKeyError.js";
import userRepository from "../repositories/user.repository.js";
import getFriendIds from "../utils/getFriendIds.js";
import FriendModel, { FriendDocument } from "../models/friend.model.js";

const sendFriendRequest = async (senderId: string, receiverId: string) => {
    const isSelfRequest = senderId === receiverId;

    if (isSelfRequest) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "You cannot send a friend request to yourself.",
        );
    }

    const alreadyReceivedRequest = await friendRepository.hasPendingFriendRequest(
        senderId,
        receiverId,
    );

    if (alreadyReceivedRequest) {
        throw new ApiError(StatusCodes.CONFLICT, "A friend request is already pending.");
    }

    try {
        const friend = await friendRepository.create(senderId, receiverId);

        return friend;
    } catch (err: any) {
        if (isDuplicateKeyError(err)) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "You’ve already sent a friend request to this user.",
            );
        }

        throw err;
    }
};

const getFriendSuggestions = async (userId: string) => {
    const friendships = await friendRepository.findFriendshipsByStatus({
        currentUserId: userId,
    });

    const friendIds = getFriendIds(userId, friendships);

    const suggestions = await userRepository.findRandomUserSuggestions(userId, friendIds);

    return suggestions;
};

const getFriendsByStatus = async (userId: string, status: FriendDocument["status"]) => {
    const friendships = await friendRepository.findFriendshipsByStatus({
        currentUserId: userId,
        status,
        fields: "sender receiver",
    });

    if (friendships.length === 0) {
        return [];
    }

    const friendIds = getFriendIds(userId, friendships);

    const friendProfiles = await userRepository.findUsersByIds(friendIds);

    return friendProfiles;
};

const acceptFriendRequest = async (userId: string, friendshipId: string) => {
    const friendship = await FriendModel.findOne({
        _id: friendshipId,
        receiver: userId,
    })
        .select("-createdAt -updatedAt")
        .lean();

    if (!friendship) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Unable to accept friend request.");
    }

    if (friendship.status === "accepted") {
        throw new ApiError(StatusCodes.CONFLICT, "You're already friends with this user.");
    }

    if (friendship.status === "canceled") {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "This friend request has been canceled and cannot be accepted.",
        );
    }

    if (friendship.status === "rejected") {
        throw new ApiError(StatusCodes.CONFLICT, "You already rejected this friend request.");
    }

    await friendRepository.updateStatusById(friendshipId, "accepted");
};

export default { sendFriendRequest, getFriendSuggestions, getFriendsByStatus, acceptFriendRequest };
