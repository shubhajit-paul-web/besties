import { StatusCodes } from "http-status-codes";
import messageService from "../services/message.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import {
    GenerateFileDownloadUrlRequest,
    GenerateFileUploadUrlRequest,
} from "../types/message/message.request.js";

const getMessages = asyncHandler(async (req, res) => {
    const currentUserId = req.user?._id as string;
    const friendId = req.params.friendId as string;

    const messages = await messageService.getMessagesByConversationKey(currentUserId, friendId);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Messages fetched successfully", messages));
});

const generateFileUploadUrl = asyncHandler(async (req: GenerateFileUploadUrlRequest, res) => {
    const currentUserId = req.user?._id as string;
    const { friendId, contentType } = req.body;

    const result = await messageService.generateFileUploadUrl(currentUserId, friendId, contentType);

    return res.status(StatusCodes.OK).json(result);
});

const generateFileDownloadUrl = asyncHandler(async (req: GenerateFileDownloadUrlRequest, res) => {
    const userId = req.user?._id as string;
    const { path, messageId } = req.body;

    const url = await messageService.generateFileDownloadUrl(userId, path, messageId);

    return res.status(StatusCodes.OK).json({ url });
});

export default {
    getMessages,
    generateFileUploadUrl,
    generateFileDownloadUrl,
};
