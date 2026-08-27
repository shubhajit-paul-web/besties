export interface ChatMessageInterface {
	avatar: string;
	text: string;
	isSender: boolean;
	sentAt: string;
}

export type ChatMessage = {
	// isSender: boolean;
	sender: string;
	content: string;
	createdAt: string;
};

export type AckResponse = {
	success: boolean;
	message?: string;
};
