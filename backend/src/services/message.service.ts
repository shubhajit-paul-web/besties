import { StatusCodes } from "http-status-codes";
import friendRepository from "../repositories/friend.repository.js";
import messageRepository from "../repositories/message.repository.js";
import ApiError from "../utils/apiError.js";

const getMessagesByConversationKey = async (currentUserId: string, friendId: string) => {
    const isFriend = await friendRepository.existsFriendship(currentUserId, friendId, "accepted");

    if (!isFriend) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You cannot access messages from a user who is not your friend.",
        );
    }

    const conversationKey = [currentUserId, friendId].sort().join(":");

    const messages = await messageRepository.findMessagesByConversationKey(conversationKey);

    return messages;
};

export default {
    getMessagesByConversationKey,
};
