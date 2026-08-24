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

export const getSentFriendshipsByStatusSchema = z.object({
    query: z.object({
        status: z
            .enum(
                FRIENDSHIP_STATUSES,
                `Invalid status. Must be one of: ${FRIENDSHIP_STATUSES.join(", ")}.`,
            )
            .optional(),
    }),
});

export const friendshipIdSchema = z.object({
    params: z.object({
        friendshipId: z.refine(mongoose.isValidObjectId, "Invalid friendship id"),
    }),
});

export const getUserProfileSchema = z.object({
    params: z.object({
        id: z.refine(mongoose.isValidObjectId, "Invalid user id"),
    }),
});
