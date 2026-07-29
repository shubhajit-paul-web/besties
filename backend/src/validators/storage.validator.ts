import z from "zod";
import { SUPPORTED_FILE_TYPES } from "../constants/constants.js";

export const downloadFileSchema = z.object({
    body: z.object({
        path: z.string("Path is required"),
    }),
});

export const uploadFileSchema = z.object({
    body: z.object({
        path: z.string("Path is required").min(1, "Path is missing"),
        type: z.enum(SUPPORTED_FILE_TYPES, {
            error: (issue) => {
                if (issue.input === undefined) {
                    return "Type is required";
                }

                return "Type must be one of: image/jpeg, image/png, image/gif, image/webp, image/svg+xml, video/mp4, video/webm";
            },
        }),
    }),
});
