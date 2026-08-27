import messageRepository from "../repositories/message.repository.js";

const getMessagesByConversationKey = async (conversationKey: string) => {
    const messages = await messageRepository.findMessagesByConversationKey(conversationKey);

    return messages;
};

export default {
    getMessagesByConversationKey,
};
