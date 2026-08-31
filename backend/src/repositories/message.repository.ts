import type { CreateMessageDto } from "../dto/message.dto.js";
import MessageModel from "../models/message.model.js";

const create = async (payload: CreateMessageDto) => {
    return MessageModel.create(payload);
};

const findMessagesByConversationKey = async (conversationKey: string) => {
    return MessageModel.find({
        conversationKey,
    }).lean();
};

export default {
    create,
    findMessagesByConversationKey,
};
