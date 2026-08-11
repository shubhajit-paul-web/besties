import type { SupportedFileType } from "../types/storage/storage.service.js";

export const ACCESS_TOKEN_COOKIE_EXPIRY = 10 * 60 * 1000; // valid for 10 minutes
export const REFRESH_TOKEN_COOKIE_EXPIRY = 365 * 24 * 60 * 60 * 1000; // valid for 1 year

// Allowed upload MIME types for the storage layer, keep this aligned with validators and S3 policies
export const SUPPORTED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/avif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
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
} as const;

export const FRIENDSHIP_STATUSES = ["pending", "accepted", "rejected", "canceled"] as const;
