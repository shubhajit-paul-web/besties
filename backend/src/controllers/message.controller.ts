import { StatusCodes } from "http-status-codes";
import messageService from "../services/message.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";

const getMessages = asyncHandler(async (req, res) => {
    const currentUserId = req.user?._id as string;
    const friendId = req.params.friendId as string;

    const messages = await messageService.getMessagesByConversationKey(currentUserId, friendId);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Messages fetched successfully", messages));
});

export default {
    getMessages,
};
