import type { ChatMessage } from "../types/chat.types";

// Merge persisted + realtime messages, deduplicate them, and sort by creation time
const getConversationMessages = (persistedMessages: ChatMessage[] = [], realtimeMessages: ChatMessage[] = [], conversationKey: string) => {
	const messages = new Map<string, ChatMessage>();

	for (const message of [...persistedMessages, ...realtimeMessages]) {
		if (message.conversationKey !== conversationKey) {
			continue;
		}

		const key = message._id?.toString() ?? message.clientMessageId;

		if (!key) continue;

		messages.set(key, message);
	}

	return Array.from(messages.values()).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
};

export default getConversationMessages;
