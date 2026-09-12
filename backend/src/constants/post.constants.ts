import { SupportedFileType } from "../types/post/post.types.js";

// Supported MIME types
export const SUPPORTED_CONTENT_TYPES = [
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

    // Documents
    "application/pdf",
] as const;

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

    // Documents
    "application/pdf": "pdf",
};

export const POST_VISIBILITY_LEVELS = ["public", "friends", "private"] as const;
export const POST_STATUS_VALUES = ["active", "deleted", "archived"] as const;
