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
