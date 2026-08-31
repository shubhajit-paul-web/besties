import { StatusCodes } from "http-status-codes";
import friendRepository from "../repositories/friend.repository.js";
import messageRepository from "../repositories/message.repository.js";
import ApiError from "../utils/apiError.js";
import { SupportedFileType } from "../types/storage/storage.service.js";
import storageService from "./storage.service.js";
import generateConversationKey from "../utils/generateConversationKey.js";

const getMessagesByConversationKey = async (currentUserId: string, friendId: string) => {
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

            if (!file) {
                return message;
            }

            return {
                ...message,
                file: {
                    ...file,
                    path: await storageService.downloadFile(file.path),
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

export default {
    getMessagesByConversationKey,
    generateFileUploadUrl,
};
