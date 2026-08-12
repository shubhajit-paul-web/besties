import mongoose from "mongoose";
import z from "zod";
import { FRIENDSHIP_STATUSES } from "../constants/constants.js";

export const sendFriendRequestSchema = z.object({
    body: z.object({
        receiverId: z
            .string("Receiver ID is required")
            .trim()
            .min(1, "Receiver ID is required")
            .refine(mongoose.isValidObjectId, "Invalid receiver ID"),
    }),
});

export const getFriendsByStatusSchema = z.object({
    query: z.object({
        status: z
            .enum(
                FRIENDSHIP_STATUSES,
                `Invalid status. Must be one of: ${FRIENDSHIP_STATUSES.join(", ")}.`,
            )
            .optional(),
    }),
});

export const acceptFriendRequestSchema = z.object({
    params: z.object({
        id: z.refine(mongoose.isValidObjectId, "Invalid friendship ID"),
    }),
});

export const getFriendshipsByStatusSchema = z.object({
    query: z.object({
        status: z
            .enum(
                FRIENDSHIP_STATUSES,
                `Invalid status. Must be one of: ${FRIENDSHIP_STATUSES.join(", ")}.`,
            )
            .optional(),
    }),
});
