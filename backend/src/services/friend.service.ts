/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import friendRepository from "../repositories/friend.repository.js";
import isDuplicateKeyError from "../utils/isDuplicateKeyError.js";
import userRepository from "../repositories/user.repository.js";
import getFriendIds from "../utils/getFriendIds.js";
import FriendModel, { type FriendDocument } from "../models/friend.model.js";
import moment from "moment";

const sendFriendRequest = async (senderId: string, receiverId: string) => {
    const isSelfRequest = senderId === receiverId;

    if (isSelfRequest) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "You cannot send a friend request to yourself.",
        );
    }

    const existingFriendship = await friendRepository.findRelationshipBetweenUsers(
        senderId,
        receiverId,
    );

    if (existingFriendship) {
        const { _id: friendshipId, sender, status, rejectionExpiresAt } = existingFriendship;

        if (status === "pending") {
            throw new ApiError(StatusCodes.CONFLICT, "A friend request is already pending.");
        }

        if (status === "accepted") {
            throw new ApiError(StatusCodes.CONFLICT, "You are already friends with this user.");
        }

        if (status === "rejected") {
            if (String(sender) === senderId) {
                const now = moment();
                const expiry = moment(rejectionExpiresAt);

                if (now.isBefore(expiry)) {
                    const remaining = moment.duration(expiry.diff(now));

                    const days = Math.floor(remaining.asDays());
                    const hours = remaining.hours();

                    throw new ApiError(
                        StatusCodes.CONFLICT,
                        `You can send a friend request again in ${days} days and ${hours} hours.`,
                    );
                }

                // remove the previous rejected friend request
                await friendRepository.deleteFriendshipById(friendshipId);
            }
        }
    }

    try {
        const friend = await friendRepository.create(senderId, receiverId);

        return friend;
    } catch (err: any) {
        if (isDuplicateKeyError(err)) {
            throw new ApiError(
                StatusCodes.CONFLICT,
                "A friend request already exists for this user.",
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
    const friendship = await friendRepository.findFriendshipByIdAndReceiver(friendshipId, userId);

    if (!friendship) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Unable to accept friend request.");
    }

    if (friendship.status === "accepted") {
        throw new ApiError(StatusCodes.CONFLICT, "You're already friends with this user.");
    }

    if (friendship.status === "rejected") {
        throw new ApiError(StatusCodes.CONFLICT, "You already rejected this friend request.");
    }

    await friendRepository.updateStatusById(friendshipId, "accepted");
};

const getSentFriendshipsByStatus = async (userId: string, status: FriendDocument["status"]) => {
    const friendships = await friendRepository.findSentFriendRequestsByStatus(userId, status);

    return friendships;
};

const getReceivedFriendRequests = async (userId: string) => {
    const requests = await friendRepository.findPendingRequestsByReceiver(userId);

    return requests;
};

const removeFriend = async (userId: string, friendshipId: string) => {
    const deleted = await friendRepository.deleteFriendship(userId, friendshipId);

    if (deleted.deletedCount === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Friendship not found.");
    }
};

const rejectFriendRequest = async (userId: string, friendshipId: string) => {
    const friendRequest = await friendRepository.findFriendshipByIdAndReceiver(
        friendshipId,
        userId,
        "status",
    );

    if (!friendRequest) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Friend request not found.");
    }

    if (friendRequest.status !== "pending") {
        throw new ApiError(
            StatusCodes.CONFLICT,
            `This request is already ${friendRequest.status}.`,
        );
    }

    const now = moment();
    const rejectionExpiresAt = now.clone().add(7, "days").toDate();

    await friendRepository.rejectFriendRequest(friendshipId, now.toDate(), rejectionExpiresAt);
};

const cancelFriendRequest = async (userId: string, friendshipId: string) => {
    const friendRequest = await friendRepository.findFriendshipByIdAndSender(friendshipId, userId);

    if (!friendRequest) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Friend request not found.");
    }

    if (friendRequest.status !== "pending") {
        throw new ApiError(StatusCodes.CONFLICT, "Only pending friend requests can be canceled.");
    }

    await FriendModel.deleteOne({
        _id: friendshipId,
    });
};

export default {
    sendFriendRequest,
    getFriendSuggestions,
    getFriendsByStatus,
    acceptFriendRequest,
    getSentFriendshipsByStatus,
    getReceivedFriendRequests,
    removeFriend,
    rejectFriendRequest,
    cancelFriendRequest,
};
