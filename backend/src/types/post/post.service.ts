import type { Request } from "express";
import type { SupportedFileType } from "./post.types.js";

export interface GenerateFileUploadUrlRequest<T = SupportedFileType> extends Request {
    body: {
        contentType: T;
    };
}
