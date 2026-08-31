import { InferSchemaType, Schema, Types, model } from "mongoose";

const fileSchema = new Schema(
    {
        path: {
            type: String,
            trim: true,
            required: true,
        },
        fileName: {
            type: String,
            trim: true,
        },
        contentType: {
            type: String,
            trim: true,
            required: true,
        },
        size: {
            type: Number,
            required: true,
        },
    },
    { versionKey: false },
);

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
        maxLength: 1000,
    },
    file: fileSchema,
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
