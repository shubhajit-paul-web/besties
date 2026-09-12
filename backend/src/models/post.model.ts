import { InferSchemaType, model, Schema, Types } from "mongoose";
import { POST_STATUS_VALUES, POST_VISIBILITY_LEVELS } from "../constants/post.constants.js";

const fileSchema = new Schema(
    {
        path: {
            type: String,
            trim: true,
            required: true,
        },
        contentType: {
            type: String,
            trim: true,
            required: true,
        },
        // size: {
        //     type: Number,
        //     min: 1,
        //     required: true,
        // },
    },
    { _id: false, versionKey: false },
);

const postSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: "User",
            required: true,
        },
        content: {
            type: String,
            trim: true,
            maxLength: 2000,
        },
        files: {
            type: [fileSchema],
            default: [],
        },
        feeling: {
            type: String,
            trim: true,
        },
        visibility: {
            type: String,
            enum: POST_VISIBILITY_LEVELS,
            default: "friends",
        },
        isAIGenerated: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            enum: POST_STATUS_VALUES,
            default: "active",
        },
    },
    { timestamps: true },
);

// User's posts → filter by status + visibility, newest first
postSchema.index({
    user: 1,
    status: 1,
    visibility: 1,
    createdAt: -1,
});

// Public feed → active public posts, newest first
postSchema.index({
    status: 1,
    visibility: 1,
    createdAt: -1,
});

export type PostDocument = InferSchemaType<typeof postSchema>;

const PostModel = model("Post", postSchema);
export default PostModel;
