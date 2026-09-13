import type { SUPPORTED_CONTENT_TYPES } from "../constants/constants";

export type PostVisibility = "public" | "friends" | "private";
export type AttachmentCategory = "image" | "video" | "pdf";

export type SupportedFileType = (typeof SUPPORTED_CONTENT_TYPES)[number];

export type AttachmentPickerProps = {
	attachments: PostAttachment[];
	onChange: (attachments: PostAttachment[]) => void;
	error: string | null;
	onError: (error: string | null) => void;
};

export type AiLabelToggleProps = {
	checked: boolean;
	onChange: (checked: boolean) => void;
};

export type PostVisibilitySelectorProps = {
	value: PostVisibility;
	onChange: (value: PostVisibility) => void;
};

export type CreatePostModalProps = {
	open: boolean;
	onClose: () => void;
};

export type FeelingActivityPickerProps = {
	value: FeelingOption | null;
	onChange: (value: FeelingOption | null) => void;
};

export type PostPreviewProps = {
	values: CreatePostFormValues;
	avatarUrl: string;
	userName: string;
};

export type FeelingOption = {
	id: string;
	label: string;
	icon: string;
};

export type PostAttachment = {
	id: string;
	file: File;
	previewUrl: string;
	category: AttachmentCategory;
};

export type CreatePostFormValues = {
	content: string;
	visibility: PostVisibility;
	feeling: FeelingOption | null;
	isAIGenerated: boolean;
	attachments: PostAttachment[];
};

export type FileAttachmentPayload = {
	path: string;
	contentType: SupportedFileType;
};

export type CreatePostPayload = {
	content?: string;
	visibility: PostVisibility;
	feeling?: FeelingOption["id"];
	isAIGenerated: boolean;
	files?: FileAttachmentPayload[];
};
