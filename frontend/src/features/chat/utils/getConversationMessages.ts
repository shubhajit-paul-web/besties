import type { ChatMessage } from "../types/chat.types";

const getConversationMessages = (existingMessages: ChatMessage[], realtimeMessages: ChatMessage[], conversationKey: string) => {
	const allMessages = [...existingMessages, ...realtimeMessages];

	const conversationMessages = allMessages.filter((message) => message.conversationKey === conversationKey);

	return conversationMessages.sort((messageA, messageB) => new Date(messageA.createdAt).getTime() - new Date(messageB.createdAt).getTime());
};

export default getConversationMessages;
