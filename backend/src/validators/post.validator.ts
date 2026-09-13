import { z } from "zod";
import {
    POST_FEELING_IDS,
    POST_STATUS_VALUES,
    POST_VISIBILITY_LEVELS,
    SUPPORTED_CONTENT_TYPES,
} from "../constants/post.constants.js";
import { isValidObjectId } from "mongoose";

export const postIdSchema = z.object({
    params: z.object({
        postId: z.refine(isValidObjectId, "Invalid post id"),
    }),
});

// Sub-document schema for files with strict contentType check
export const fileValidationSchema = z.object({
    path: z.string("File path is required").trim().min(1, "Path cannot be empty"),
    contentType: z.enum(
        SUPPORTED_CONTENT_TYPES,
        "Unsupported file type. Allowed: JPEG, PNG, WEBP, GIF, AVIF, MP4, WEBM, QuickTime, PDF",
    ),
    // size: z.number("File size is required").positive("Size must be greater than 0"),
});

const postBodySchema = z.object({
    content: z.string().trim().max(2000, "Content cannot exceed 2000 characters").optional(),
    files: z.array(fileValidationSchema).default([]),
    feeling: z.enum(
        POST_FEELING_IDS,
        `Unsupported feeling id. Allowed: ${POST_FEELING_IDS.join(", ")}`,
    ),
    visibility: z
        .enum(POST_VISIBILITY_LEVELS, "Visibility must be either 'public', 'friends', or 'private'")
        .default("friends"),
    isAIGenerated: z.boolean("isAIGenerated must be a boolean (true or false)").default(false),
    status: z
        .enum(POST_STATUS_VALUES, "Status must be either 'active', 'deleted', or 'archived'")
        .default("active"),
});

export const createPostSchema = z.object({
    body: postBodySchema.refine((data) => Boolean(data.content?.length || data.files?.length), {
        error: "A post must include either text content or at least one file",
        path: ["content"],
    }),
});

export const generateFileUploadUrlSchema = z.object({
    body: z.object({
        contentType: z.enum(
            SUPPORTED_CONTENT_TYPES,
            `Unsupported file type. Allowed: ${SUPPORTED_CONTENT_TYPES.join(", ")}`,
        ),
    }),
});

export const updatePostSchema = z.object({
    params: postIdSchema.shape.params,
    body: postBodySchema.omit({ files: true }).partial(),
});

// Inferred TypeScript types
export type FileInput = z.infer<typeof fileValidationSchema>;
