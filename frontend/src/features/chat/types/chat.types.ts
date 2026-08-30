import type { UserType } from "@/types/user.types";
import type { ReactNode, SubmitEvent } from "react";

export type AttachmentType = "image" | "video" | "audio" | "document" | "file";

export type AttachmentData = {
	path: string;
	type: string;
	filename?: string;
	size?: number;
	mimeType?: string;
};

export type ChatMessageProps = {
	avatar: string;
	text: string;
	isSender: boolean;
	attachment?: AttachmentData;
	sentAt: string;
};

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

export type AttachmentPreviewModalProps = {
	open: boolean;
	selectedFile: File | null;
	previewUrl: string;
	fileError: string | null;
	onClose: () => void;
	onUpload: () => void;
};

export type AttachmentPreviewProps = {
	attachment: AttachmentData;
	caption?: string;
	isSender: boolean;
	onImageClick?: () => void;
};
