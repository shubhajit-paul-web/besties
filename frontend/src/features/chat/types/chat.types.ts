import type { UserType } from "@/types/user.types";
import type { ReactNode, SubmitEvent } from "react";

export type AttachmentType = "image" | "video" | "audio" | "document" | "file";

export type AttachmentData = {
	path: string;
	contentType: string;
	fileName?: string;
	size?: number;
	mimeType?: string;
};

export type ChatHeaderProps = {
	isLoading: boolean;
	name: {
		first: string;
		last?: string;
	};
	avatar?: string;
	friendId: string;
};

export type ChatMessageProps = {
	avatar: string;
	text: string | undefined;
	isSender: boolean;
	attachment?: AttachmentData;
	sentAt: string;
};

export type ChatMessage = {
	_id?: string;
	clientMessageId?: string;
	sender: string;
	receiver?: string;
	content: string | undefined;
	createdAt: string;
	conversationKey?: string;
	file?: AttachmentData;
};

export type ChatMessageWithFile = {
	path: string;
	size: number;
	contentType: string;
	fileName?: string | null;
	caption?: string;
};

export type AckResponse = {
	success: boolean;
	message?: string;
};

export type FriendInfo = Pick<UserType, "_id" | "name" | "avatar" | "username">;

export type ChatContainerProps = {
	isLoadingFriendInfo: boolean;
	friend: FriendInfo;
	handleSendMessage?: (event: SubmitEvent<Element>) => void;
	handleSendMessageWithFile?: (file: ChatMessageWithFile) => void;
	children: ReactNode;
};

export type AttachmentLightboxProps = {
	open: boolean;
	attachment: AttachmentData | null;
	onClose: () => void;
};

export type AttachmentPreviewModalProps = {
	open: boolean;
	selectedFile: File | null;
	previewUrl: string;
	fileError: string | null;
	isUploading: boolean;
	uploadProgress: number;
	onClose: () => void;
	onSend: (caption: string) => void;
};

export type AttachmentPreviewProps = {
	attachment: AttachmentData;
	caption?: string;
	isSender: boolean;
	onImageClick?: () => void;
};
