import z from "zod";
import { SUPPORTED_FILE_TYPES } from "../constants/constants.js";

const supportedAvatarFileType = SUPPORTED_FILE_TYPES.filter((type) => type.startsWith("image/"));

export const generateAvatarUploadUrlSchema = z.object({
    body: z.object({
        type: z.enum(
            supportedAvatarFileType,
            `Avatar must be a ${supportedAvatarFileType.join(", ")}`,
        ),
    }),
});

export const updateAvatarSchema = z.object({
    body: z.object({
        path: z.string("Path is required").trim().min(1, "Path is required"),
    }),
});
