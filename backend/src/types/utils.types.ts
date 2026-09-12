import { Request } from "express";
import z from "zod";
import { SupportedFileType } from "./post/post.types.js";

export type RequestValidationSchema = z.ZodObject<{
    body?: z.ZodType;
    params?: z.ZodType;
    query?: z.ZodType;
}>;

// Converts all properties of a type to string
export type Stringify<T> = {
    [K in keyof T]: string;
};

export interface GenerateFileUploadUrlRequest<T = SupportedFileType> extends Request {
    body: {
        contentType: T;
    };
}
