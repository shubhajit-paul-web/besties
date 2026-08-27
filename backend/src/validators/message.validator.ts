import mongoose from "mongoose";
import z from "zod";

export const friendIdSchema = z.object({
    params: z.object({
        friendId: z.refine(mongoose.isValidObjectId, "Invalid friend id"),
    }),
});
