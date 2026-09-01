import z from "zod";
import mongoose from "mongoose";
import { SUPPORTED_FILE_TYPES } from "../constants/constants.js";

const objectIdSchema = z.string().refine(mongoose.isValidObjectId, "Invalid MongoDB ObjectId");

export const friendIdSchema = z.object({
    params: z.object({
        friendId: objectIdSchema,
    }),
});

export const generateFileUploadUrlSchema = z.object({
    body: z.object({
        friendId: z
            .string()
            .min(1, "Friend id required")
            .refine(mongoose.isValidObjectId, "Invalid friend id"),
        contentType: z.enum(SUPPORTED_FILE_TYPES, "This file type is not allowed"),
    }),
});

export const generateFileDownloadUrlSchema = z
    .object({
        body: z.object({
            path: z.string().optional(),
            messageId: objectIdSchema.optional(),
        }),
    })
    .refine(({ body }) => body.path || body.messageId, "Either path or messageId is required");
