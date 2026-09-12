import { Request } from "express";
import { CreatePostPayload } from "./post.types.js";

export interface createPostRequest extends Request {
    body: CreatePostPayload;
}
