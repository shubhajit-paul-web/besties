/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import friendRepository from "../repositories/friend.repository.js";
import isDuplicateKeyError from "../utils/isDuplicateKeyError.js";
import userRepository from "../repositories/user.repository.js";
import getFriendIds from "../utils/getFriendIds.js";

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
    const friends = await friendRepository.findAcceptedFriendships(userId);

    const friendIds = getFriendIds(userId, friends);

    const suggestions = await userRepository.findRandomUserSuggestions(userId, friendIds);

    return suggestions;
};

const getAcceptedFriends = async (userId: string) => {
    const friendships = await friendRepository.findAcceptedFriendships(userId, "sender receiver");

    if (friendships.length === 0) {
        return [];
    }

    const friendIds = getFriendIds(userId, friendships);

    const friendProfiles = await userRepository.findUsersByIds(friendIds);

    return friendProfiles;
};

export default { sendFriendRequest, getFriendSuggestions, getAcceptedFriends };
