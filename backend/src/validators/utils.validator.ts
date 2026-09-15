import { isValidObjectId } from "mongoose";
import z from "zod";

export const userIdSchema = z.object({
    params: z.object({
        userId: z.refine(isValidObjectId, "Invalid user id"),
    }),
});
