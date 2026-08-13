import { InferSchemaType, Schema, Types, model } from "mongoose";
import { FRIENDSHIP_STATUSES } from "../constants/constants.js";

const friendSchema = new Schema(
    {
        sender: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiver: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: FRIENDSHIP_STATUSES,
            default: "pending",
        },
        rejectedAt: {
            type: Date,
            select: false,
        },
        rejectionExpiresAt: {
            type: Date,
            select: false,
        },
    },
    {
        timestamps: true,
    },
);

friendSchema.index({ sender: 1, receiver: 1 }, { unique: true });

export type FriendDocument = InferSchemaType<typeof friendSchema>;

const FriendModel = model("Friend", friendSchema);
export default FriendModel;
