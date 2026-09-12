import PostModel from "../models/post.model.js";
import { CreatePostPayload, SupportedFileType } from "../types/post/post.types.js";
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

export default {
    createPost,
    generateFileUploadUrl,
};
