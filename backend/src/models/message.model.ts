import { InferSchemaType, Schema, Types, model } from "mongoose";

const messageSchema = new Schema({
    conversationKey: {
        type: String,
        required: true,
    },
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
    content: {
        type: String,
        trim: true,
        maxLength: 1000,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

messageSchema.index({
    conversationKey: 1,
    createdAt: -1,
});

export type MessageDocument = InferSchemaType<typeof messageSchema>;

const MessageModel = model("Chat", messageSchema);
export default MessageModel;
