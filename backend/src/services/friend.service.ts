/* eslint-disable @typescript-eslint/no-explicit-any */
import FriendModel from "../models/friend.model.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import isDuplicateKeyError from "../utils/isDuplicateKeyError.js";

const addFriend = async (senderId: string, receiverId: string) => {
    const isSelfRequest = senderId === receiverId;

    if (isSelfRequest) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "You cannot send a friend request to yourself.",
        );
    }

    try {
        const friend = await FriendModel.create({
            sender: senderId,
            receiver: receiverId,
        });

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

export default { addFriend };
