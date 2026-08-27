import { CreateMessageDto } from "../dto/message.dto.js";
import MessageModel from "../models/message.model.js";

const create = async ({ conversationKey, sender, receiver, content }: CreateMessageDto) => {
    return MessageModel.create({
        conversationKey,
        sender,
        receiver,
        content,
    });
};

const findMessagesByConversationKey = async (conversationKey: string) => {
    return MessageModel.find({
        conversationKey,
    })
        .select("-conversationKey -_id -__v")
        .lean();
};

export default {
    create,
    findMessagesByConversationKey,
};
