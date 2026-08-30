import type { AttachmentType } from "../types/chat.types";
import { ImageIcon, Video, Music, FileText, FileArchive } from "lucide-react";

// File extension mappings for each attachment type
export const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
export const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"];
export const AUDIO_EXTENSIONS = ["mp3", "wav", "m4a", "aac", "flac", "wma", "ogg"];
export const DOCUMENT_EXTENSIONS = ["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"];

// Icon mapping for each attachment type
export const ATTACHMENT_ICONS = {
	image: ImageIcon,
	video: Video,
	audio: Music,
	document: FileText,
	file: FileArchive,
} as const;

/**
 * Extract file extension from filename
 */
const getFileExtension = (filename: string | undefined): string => {
	if (!filename) return "";
	return filename.split(".").pop()?.toLowerCase() || "";
};

/**
 * Determine attachment type based on filename, MIME type, or file extension
 */
export const getAttachmentType = (filename: string | undefined, mimeType: string | undefined, type: string): AttachmentType => {
	const ext = getFileExtension(filename || type);
	const mime = mimeType?.toLowerCase() || type.toLowerCase();

	if (IMAGE_EXTENSIONS.includes(ext) || mime.startsWith("image/")) {
		return "image";
	}
	if (VIDEO_EXTENSIONS.includes(ext) || mime.startsWith("video/")) {
		return "video";
	}
	if (AUDIO_EXTENSIONS.includes(ext) || mime.startsWith("audio/")) {
		return "audio";
	}
	if (DOCUMENT_EXTENSIONS.includes(ext) || mime.includes("document") || mime.includes("pdf")) {
		return "document";
	}
	return "file";
};

/**
 * Get lucide-react icon component for attachment type
 */
export const getFileIcon = (attachmentType: AttachmentType) => {
	return ATTACHMENT_ICONS[attachmentType] || ATTACHMENT_ICONS.file;
};

/**
 * Format bytes to human-readable file size
 */
export const formatFileSize = (bytes: number | undefined): string => {
	if (!bytes) return "";
	const units = ["B", "KB", "MB", "GB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${size.toFixed(2)} ${units[unitIndex]}`;
};
