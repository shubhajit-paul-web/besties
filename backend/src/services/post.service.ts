import { StatusCodes } from "http-status-codes";
import PostModel from "../models/post.model.js";
import type {
    CreatePostPayload,
    PostStatus,
    SupportedFileType,
    UpdatePostPayload,
} from "../types/post/post.types.js";
import ApiError from "../utils/apiError.js";
import storageService from "./storage.service.js";
import friendRepository from "../repositories/friend.repository.js";

// Verifies ownership and ensures the post isn't already in the target state
const getPostAndValidateOwnership = async (
    userId: string,
    postId: string,
    targetStatus: PostStatus,
) => {
    const post = await PostModel.findById(postId).select("user status").lean();

    if (!post) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Post not found or has been removed.");
    }

    if (post.user?.toString() !== userId) {
        throw new ApiError(
            StatusCodes.FORBIDDEN,
            "You do not have permission to modify this post.",
        );
    }

    if (post.status === targetStatus) {
        throw new ApiError(StatusCodes.CONFLICT, `Post is already ${targetStatus}.`);
    }

    return post;
};

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
    const post = await getPostAndValidateOwnership(userId, postId, "archived");

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

const deletePost = async (userId: string, postId: string) => {
    const post = await getPostAndValidateOwnership(userId, postId, "deleted");

    await PostModel.updateOne(
        { _id: post._id },
        {
            status: "deleted",
            $currentDate: {
                deletedAt: true,
            },
        },
    );
};

const restorePost = async (userId: string, postId: string) => {
    const post = await getPostAndValidateOwnership(userId, postId, "active");

    await PostModel.updateOne(
        { _id: post._id },
        {
            status: "active",
            archivedAt: null,
            deletedAt: null,
        },
    );
};

const getMyPostsByStatus = async (userId: string, status: PostStatus = "active") => {
    const posts = await PostModel.find({
        user: userId,
        status,
    })
        .sort({ createdAt: -1 })
        .lean();

    if (posts.length === 0) return [];

    const postsWithDownloadUrls = await Promise.all(
        posts.map(async (currentPost) => {
            const files = currentPost.files;

            if (files.length === 0) return currentPost;

            // Generate all file URLs at the same time. If one fails, the others still work
            const fileDownloadOutcomes = await Promise.allSettled(
                files.map((file) => storageService.downloadFile(file.path)),
            );

            return {
                ...currentPost,

                // Preserve the original file order and expose an empty path for failed URLs
                files: fileDownloadOutcomes.map((outcome, index) => {
                    return {
                        path: outcome.status === "fulfilled" ? outcome.value : null,
                        contentType: files[index].contentType,
                    };
                }),
            };
        }),
    );

    return postsWithDownloadUrls;
};

const getProfilePosts = async (viewerId: string, profileUserId: string) => {
    if (viewerId === profileUserId) {
        return await getMyPostsByStatus(viewerId, "active");
    }

    const isFriend = await friendRepository.existsFriendship(viewerId, profileUserId, "accepted");

    if (isFriend) {
        const posts = await PostModel.find({
            user: profileUserId,
            visibility: {
                $in: ["public", "friends"],
            },
            status: "active",
        }).lean();

        return posts;
    }

    const posts = await PostModel.find({
        user: profileUserId,
        visibility: "public",
        status: "active",
    }).lean();

    return posts;
};

export default {
    createPost,
    generateFileUploadUrl,
    updatePost,
    archivePost,
    deletePost,
    restorePost,
    getMyPostsByStatus,
    getProfilePosts,
};
