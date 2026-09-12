import { z } from "zod";
import {
    POST_STATUS_VALUES,
    POST_VISIBILITY_LEVELS,
    SUPPORTED_CONTENT_TYPES,
} from "../constants/post.constants.js";

// Helper validator ObjectId
// const objectIdSchema = z
//     .string("User ID is required")
//     .trim()
//     .refine((val) => isValidObjectId(val), {
//         message: "Invalid ObjectId format",
//     });

// Sub-document schema for files with strict contentType check
export const fileValidationSchema = z.object({
    path: z.string("File path is required").trim().min(1, "Path cannot be empty"),
    contentType: z.enum(
        SUPPORTED_CONTENT_TYPES,
        "Unsupported file type. Allowed: JPEG, PNG, WEBP, GIF, AVIF, MP4, WEBM, QuickTime, PDF",
    ),
    // size: z.number("File size is required").positive("Size must be greater than 0"),
});

// Create post schema
export const createPostSchema = z.object({
    body: z
        .object({
            content: z
                .string()
                .trim()
                .max(2000, "Content cannot exceed 2000 characters")
                .optional(),
            files: z.array(fileValidationSchema).default([]),
            feeling: z.string().trim().optional(),
            visibility: z
                .enum(
                    POST_VISIBILITY_LEVELS,
                    "Visibility must be either 'public', 'friends', or 'private'",
                )
                .default("friends"),
            isAIGenerated: z
                .boolean("isAIGenerated must be a boolean (true or false)")
                .default(false),
            status: z
                .enum(
                    POST_STATUS_VALUES,
                    "Status must be either 'active', 'deleted', or 'archived'",
                )
                .default("active"),
        })
        .refine((data) => data.content?.length || data.files?.length, {
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

// Inferred TypeScript types
export type FileInput = z.infer<typeof fileValidationSchema>;
