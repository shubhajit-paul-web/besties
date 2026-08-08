import mongoose from "mongoose";
import z from "zod";

export const addFriendSchema = z.object({
    body: z.object({
        receiverId: z
            .string("Receiver ID is required")
            .trim()
            .min(1, "Receiver ID is required")
            .refine(mongoose.isValidObjectId, "Invalid receiver ID"),
    }),
});
