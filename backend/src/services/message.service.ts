import { StatusCodes } from "http-status-codes";
import friendRepository from "../repositories/friend.repository.js";
import messageRepository from "../repositories/message.repository.js";
import ApiError from "../utils/apiError.js";
import { SupportedFileType } from "../types/storage/storage.service.js";
import storageService from "./storage.service.js";
import generateConversationKey from "../utils/generateConversationKey.js";
import logger from "../utils/logger.js";
import MessageModel from "../models/message.model.js";

// Get all messages between the current user and a friend.
// Only friends can read this chat, and files get a ready-to-use download link.
const getMessagesByConversationKey = async (currentUserId: string, friendId: string) => {
    // Messages are private to accepted friendships, so authorize access first.
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

// Create a safe upload link for a file in this chat.
// This lets the client send a file without exposing the storage path directly.
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

// Create a download link for a file only if the user is allowed to see it.
// It checks the message owner or the file owner before giving access.
const generateFileDownloadUrl = async (
    userId: string,
    path: string,
    messageId: string | undefined,
) => {
    if (messageId) {
        // Resolve the stored path only after confirming the user owns the message.
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
        // For a raw path, verify storage ownership before generating a signed URL.
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
