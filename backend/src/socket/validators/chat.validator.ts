import z from "zod";
import { SUPPORTED_FILE_TYPES } from "../../constants/constants.js";

export const sendMessageSchema = z
    .object({
        clientMessageId: z.string().min(1, "Client message id is required"),
        receiver: z.string().trim().min(1),
        content: z.string().trim().max(1000).optional(),
        file: z
            .object({
                path: z.string().trim().min(1),
                fileName: z.string().trim().max(255).optional(),
                contentType: z.enum(SUPPORTED_FILE_TYPES, "File type not supported"),
                size: z.number().int().positive(),
            })
            .optional(),
    })
    .refine((data) => data.content || data.file, {
        message: "Message must contain content or a file",
    });
