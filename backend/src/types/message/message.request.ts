import type { Request } from "express";
import type { SupportedFileType } from "../storage/storage.service.js";

export interface GenerateFileUploadUrlRequest extends Request {
    body: {
        friendId: string;
        contentType: SupportedFileType;
    };
}

export interface GenerateFileDownloadUrlRequest extends Request {
    body: {
        path: string;
        messageId: string | undefined;
    };
}
