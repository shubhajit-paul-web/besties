import type { Request } from "express";
import type { CreatePostPayload, UpdatePostPayload } from "./post.types.js";

export interface createPostRequest extends Request {
    body: CreatePostPayload;
}

export interface UpdatePostRequest extends Request {
    body: UpdatePostPayload;
}
