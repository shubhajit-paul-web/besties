import type { SupportedFileType } from "../types/storage/storage.service.js";

export const ACCESS_TOKEN_COOKIE_EXPIRY = 10 * 60 * 1000; // valid for 10 minutes
export const REFRESH_TOKEN_COOKIE_EXPIRY = 365 * 24 * 60 * 60 * 1000; // valid for 1 year

// Allowed upload MIME types for the storage layer, keep this aligned with validators and S3 policies
export const SUPPORTED_FILE_TYPES = [
    // Images
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",

    // Videos
    "video/mp4",
    "video/webm",
    "video/quicktime",

    // Audio
    "audio/mpeg", // MP3
    "audio/wav", // WAV
    "audio/ogg", // OGG
    "audio/webm", // WebM audio
    "audio/mp4", // M4A
    "audio/aac", // AAC

    // Documents
    "application/pdf", // PDF
    "application/msword", // DOC
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/vnd.ms-excel", // XLS
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
    "application/vnd.ms-powerpoint", // PPT
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
    "text/plain", // TXT
    "text/csv", // CSV
] as const;

// Map each allowed file type to its normal file extension
export const FILE_TYPE_EXTENSIONS: Record<SupportedFileType, string> = {
    // Images
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",

    // Videos
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",

    // Audio
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/ogg": "ogg",
    "audio/webm": "webm",
    "audio/mp4": "m4a",
    "audio/aac": "aac",

    // Documents
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "text/plain": "txt",
    "text/csv": "csv",
} as const;

export const FRIENDSHIP_STATUSES = ["pending", "accepted", "rejected"] as const;
