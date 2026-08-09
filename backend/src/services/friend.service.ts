/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import friendRepository from "../repositories/friend.repository.js";
import isDuplicateKeyError from "../utils/isDuplicateKeyError.js";
import userRepository from "../repositories/user.repository.js";

const sendFriendRequest = async (senderId: string, receiverId: string) => {
    const isSelfRequest = senderId === receiverId;

    if (isSelfRequest) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "You cannot send a friend request to yourself.",
        );
    }

    const hasPendingFriendRequest = await friendRepository.hasPendingIncoming(senderId, receiverId);

    if (hasPendingFriendRequest) {
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
    const friends = await friendRepository.findAcceptedFriends(userId);

    const friendIds = friends.map((user) => {
        if (String(user.sender) === userId) {
            return user.receiver;
        }

        return user.sender;
    });

    const suggestions = await userRepository.findRandomUserSuggestions(userId, friendIds);

    return suggestions;
};

export default { sendFriendRequest, getFriendSuggestions };
