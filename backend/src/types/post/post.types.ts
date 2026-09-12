import z from "zod";
import { SUPPORTED_CONTENT_TYPES } from "../../constants/post.constants.js";
import { createPostSchema } from "../../validators/post.validator.js";

export type SupportedFileType = (typeof SUPPORTED_CONTENT_TYPES)[number];

export type CreatePostPayload = z.infer<typeof createPostSchema.shape.body>;
