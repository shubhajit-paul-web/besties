import { StatusCodes } from "http-status-codes";
import friendRepository from "../repositories/friend.repository.js";
import messageRepository from "../repositories/message.repository.js";
import ApiError from "../utils/apiError.js";
import { SupportedFileType } from "../types/storage/storage.service.js";
import storageService from "./storage.service.js";
import generateConversationKey from "../utils/generateConversationKey.js";
import logger from "../utils/logger.js";
import MessageModel from "../models/message.model.js";

const getMessagesByConversationKey = async (currentUserId: string, friendId: string) => {
    /* 
        Messages are private to the friendship, so authorize access before
        retrieving any messages from the conversation.
    */
    const isFriend = await friendRepository.existsFriendship(currentUserId, friendId, "accepted");

    if (!isFriend) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You cannot access messages from a user who is not your friend.",
        );
    }

    const conversationKey = generateConversationKey(currentUserId, friendId);

    const messages = await messageRepository.findMessagesByConversationKey(conversationKey);

    const customizedMessages = await Promise.all(
        messages.map(async (message) => {
            const file = message.file;

            if (!file?.path) {
                return message;
            }

            const path = await storageService.downloadFile(file.path).catch((err: unknown) => {
                logger.error("Failed to generate signed URL for message file", {
                    messageId: message._id,
                    userId: currentUserId,
                    filePath: file.path,
                    err,
                });

                return null;
            });

            return {
                ...message,
                file: {
                    ...file,
                    path,
                },
            };
        }),
    );

    return customizedMessages;
};

const generateFileUploadUrl = async (
    userId: string,
    friendId: string,
    contentType: SupportedFileType,
) => {
    const conversationKey = generateConversationKey(userId, friendId);

    const result = await storageService.createPresignedPostUpload({
        userId,
        path: `chat-files/${conversationKey}`,
        type: contentType,
        expires: 10 * 60, // 10 minutes
        maxFileSize: 100 * 1024 * 1024, // 100 MB
        acl: "private",
    });

    return result;
};

const generateFileDownloadUrl = async (
    userId: string,
    path: string,
    messageId: string | undefined,
) => {
    if (messageId) {
        /* 
            When a message ID is provided, resolve the file path from the message
            after verifying that the user is either the sender or receiver. 
        */
        const message = await MessageModel.findOne({
            _id: messageId,
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .select("file.path")
            .lean();

        if (!message) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Message not found.");
        }

        if (!message.file?.path) {
            throw new ApiError(StatusCodes.NOT_FOUND, "No file attached to this message.");
        }

        path = message.file.path;
    } else {
        /* 
            Without a message ID, verify ownership directly from the storage path 
            before generating a URL. This prevents users from accessing arbitrary files. 
        */
        const isOwner = await storageService.validateObjectOwnership(userId, path);

        if (!isOwner) {
            throw new ApiError(
                StatusCodes.FORBIDDEN,
                "You do not have permission to access this file.",
            );
        }
    }

    try {
        // Generate the signed download URL only after the file access has been authorized
        const url = await storageService.downloadFile(path);
        return url;
    } catch (err: unknown) {
        logger.error("Failed to generate file download URL", {
            messageId,
            userId,
            filePath: path,
            err,
        });

        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to generate file download URL.",
        );
    }
};

export default {
    getMessagesByConversationKey,
    generateFileUploadUrl,
    generateFileDownloadUrl,
};
