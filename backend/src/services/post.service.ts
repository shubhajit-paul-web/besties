import { StatusCodes } from "http-status-codes";
import PostModel from "../models/post.model.js";
import type {
    CreatePostPayload,
    SupportedFileType,
    UpdatePostPayload,
} from "../types/post/post.types.js";
import ApiError from "../utils/apiError.js";
import storageService from "./storage.service.js";

const generateFileUploadUrl = async (userId: string, contentType: SupportedFileType) => {
    const result = await storageService.createPresignedPostUpload({
        userId,
        path: `posts/${userId}`,
        type: contentType,
        expires: 15 * 60, // 15 minutes
        maxFileSize: 100 * 1024 * 1024, // 100 MB
        acl: "private",
    });

    return result;
};

const createPost = async (userId: string, payload: CreatePostPayload) => {
    const createdPost = await PostModel.create({
        ...payload,
        user: userId,
    });

    return createdPost;
};

const updatePost = async (userId: string, postId: string, payload: UpdatePostPayload) => {
    const post = await PostModel.findById(postId).select("user").lean();

    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Post not found or has been removed.");
    }

    const isOwner = post.user?.toString() === userId;

    if (!isOwner) {
        throw new ApiError(StatusCodes.FORBIDDEN, "You don't have permission to edit this post.");
    }

    const updatedPost = await PostModel.findByIdAndUpdate(post._id, payload, {
        new: true,
        runValidators: true,
    });

    return updatedPost;
};

const archivePost = async (userId: string, postId: string) => {
    const post = await PostModel.findById(postId).select("user status").lean();

    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Post not found or has been removed.");
    }

    const isOwner = post.user?.toString() === userId;

    if (!isOwner) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You don't have permission to archived this post.",
        );
    }

    if (post.status === "archived") {
        throw new ApiError(StatusCodes.CONFLICT, "Post is already archived.");
    }

    await PostModel.updateOne(
        { _id: post._id },
        {
            status: "archived",
            $currentDate: {
                archivedAt: true,
            },
        },
    );
};

export default {
    createPost,
    generateFileUploadUrl,
    updatePost,
    archivePost,
};
