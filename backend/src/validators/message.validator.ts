import z from "zod";
import mongoose from "mongoose";
import { SUPPORTED_FILE_TYPES } from "../constants/constants.js";

export const friendIdSchema = z.object({
    params: z.object({
        friendId: z.refine(mongoose.isValidObjectId, "Invalid friend id"),
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
