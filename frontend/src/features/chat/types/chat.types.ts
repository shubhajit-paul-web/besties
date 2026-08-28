import type { UserType } from "@/types/user.types";
import type { ReactNode, SubmitEvent } from "react";

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

export type FriendInfo = Pick<UserType, "_id" | "name" | "avatar" | "username">;

export type ChatContainerProps = {
	isLoadingFriendInfo: boolean;
	friend: FriendInfo;
	handleSendMessage: (event: SubmitEvent<Element>) => void;
	children: ReactNode;
};
