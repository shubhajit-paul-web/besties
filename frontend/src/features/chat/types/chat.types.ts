export interface ChatMessageProps {
	avatar: string;
	text: string;
	isSender: boolean;
	sentAt: string;
}

export type ChatMessage = {
	_id: string;
	sender: string;
	receiver?: string;
	content: string;
	createdAt: string;
	conversationKey: string;
};

export type AckResponse = {
	success: boolean;
	message?: string;
};
