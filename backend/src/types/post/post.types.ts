import z from "zod";
import { SUPPORTED_CONTENT_TYPES } from "../../constants/post.constants.js";
import { createPostSchema, updatePostSchema } from "../../validators/post.validator.js";
import type { Stringify } from "../utils.types.js";
import type { PostDocument } from "../../models/post.model.js";

export type SupportedFileType = (typeof SUPPORTED_CONTENT_TYPES)[number];

export type CreatePostPayload = z.infer<typeof createPostSchema.shape.body>;

export type UpdatePostPayload = z.infer<typeof updatePostSchema.shape.body>;

export type PostStatus = Stringify<PostDocument["status"]>;
