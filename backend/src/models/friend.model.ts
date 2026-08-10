import { InferSchemaType, Schema, Types, model } from "mongoose";

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
            enum: ["pending", "accepted", "rejected"],
            default: "pending",
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
