import { StatusCodes } from "http-status-codes";
import postService from "../services/post.service.js";
import { createPostRequest, UpdatePostRequest } from "../types/post/post.request.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { GenerateFileUploadUrlRequest } from "../types/utils.types.js";
import { PostStatus } from "../types/post/post.types.js";

// Creates a temporary URL for uploading a post file.
const generateFileUploadUrl = asyncHandler(async (req: GenerateFileUploadUrlRequest, res) => {
    const result = await postService.generateFileUploadUrl(
        req.user?._id as string,
        req.body.contentType,
    );

    return res.status(StatusCodes.CREATED).json(result);
});

// Creates a new post for the current user.
const createPost = asyncHandler(async (req: createPostRequest, res) => {
    const createdPost = await postService.createPost(req.user?._id as string, req.body);

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.created("Post created successfully", createdPost));
});

// Updates a post owned by the current user.
const updatePost = asyncHandler(async (req: UpdatePostRequest, res) => {
    const userId = req.user?._id as string;
    const postId = req.params.postId as string;

    const updatedPost = await postService.updatePost(userId, postId, req.body);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Post updated successfully.", updatedPost as object));
});

// Hides a post without removing it permanently.
const archivePost = asyncHandler(async (req, res) => {
    await postService.archivePost(req.user?._id as string, req.params.postId as string);

    return res.status(StatusCodes.OK).json(ApiResponse.success("Post archived successfully."));
});

// Permanently removes a post.
const deletePost = asyncHandler(async (req, res) => {
    await postService.deletePost(req.user?._id as string, req.params.postId as string);

    return res.status(StatusCodes.OK).json(ApiResponse.success("Post deleted successfully."));
});

// Makes an archived post visible again.
const restorePost = asyncHandler(async (req, res) => {
    await postService.restorePost(req.user?._id as string, req.params.postId as string);

    return res.status(StatusCodes.OK).json(ApiResponse.success("Post activated successfully."));
});

// Gets the current user's posts by status.
const getMyPostsByStatus = asyncHandler(async (req, res) => {
    const status = req.query.status as PostStatus;
    const posts = await postService.getMyPostsByStatus(req.user?._id as string, status);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success(`Posts fetched successfully`, posts));
});

// Gets posts shown on a user's profile.
const getProfilePosts = asyncHandler(async (req, res) => {
    const viewerId = req.user?._id as string;
    const profileUserId = req.params.userId as string;

    const posts = await postService.getProfilePosts(viewerId, profileUserId);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Profile posts fetched successfully", posts));
});

// Builds the post feed for the current user.
const generateUserFeed = asyncHandler(async (req, res) => {
    const userId = req.user?._id as string;
    const feed = await postService.generateUserFeed(userId);

    return res.status(StatusCodes.OK).json(ApiResponse.success("Feed fetched successfully", feed));
});

export default {
    createPost,
    generateFileUploadUrl,
    updatePost,
    archivePost,
    deletePost,
    restorePost,
    getMyPostsByStatus,
    getProfilePosts,
    generateUserFeed,
};
