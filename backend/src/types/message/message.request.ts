import type { Request } from "express";
import type { SupportedFileType } from "../storage/storage.service.js";
import type { MessageDocument } from "../../models/message.model.js";

export interface GenerateFileUploadUrlRequest extends Request {
    body: {
        friendId: string;
        contentType: SupportedFileType;
    };
}

export interface createFileMessageRequest extends Request {
    body: Omit<MessageDocument, "createdAt" | "file" | "sender" | "receiver"> & {
        receiver: string;
        file: NonNullable<MessageDocument["file"]>;
    };
}
