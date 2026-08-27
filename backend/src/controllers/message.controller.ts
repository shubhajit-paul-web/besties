import { StatusCodes } from "http-status-codes";
import messageService from "../services/message.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import friendRepository from "../repositories/friend.repository.js";
import ApiError from "../utils/apiError.js";

const getMessages = asyncHandler(async (req, res) => {
    const currentUserId = req.user?._id as string;
    const friendId = req.params.friendId as string;

    const isFriend = await friendRepository.existsFriendship(currentUserId, friendId, "accepted");

    if (!isFriend) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You cannot access messages from a user who is not your friend.",
        );
    }

    const conversationKey = [currentUserId, friendId].sort().join(":");

    const messages = await messageService.getMessagesByConversationKey(conversationKey);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Messages fetched successfully", messages));
});

export default {
    getMessages,
};
