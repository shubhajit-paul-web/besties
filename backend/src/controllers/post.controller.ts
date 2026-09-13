import { StatusCodes } from "http-status-codes";
import postService from "../services/post.service.js";
import { createPostRequest, UpdatePostRequest } from "../types/post/post.request.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { GenerateFileUploadUrlRequest } from "../types/utils.types.js";

const generateFileUploadUrl = asyncHandler(async (req: GenerateFileUploadUrlRequest, res) => {
    const result = await postService.generateFileUploadUrl(
        req.user?._id as string,
        req.body.contentType,
    );

    return res.status(StatusCodes.CREATED).json(result);
});

const createPost = asyncHandler(async (req: createPostRequest, res) => {
    const createdPost = await postService.createPost(req.user?._id as string, req.body);

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.created("Post created successfully", createdPost));
});

const updatePost = asyncHandler(async (req: UpdatePostRequest, res) => {
    const userId = req.user?._id as string;
    const postId = req.params.postId as string;

    const updatedPost = await postService.updatePost(userId, postId, req.body);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Post updated successfully.", updatedPost as object));
});

const archivePost = asyncHandler(async (req, res) => {
    await postService.archivePost(req.user?._id as string, req.params.postId as string);

    return res.status(StatusCodes.OK).json(ApiResponse.success("Post archived successfully."));
});

const deletePost = asyncHandler(async (req, res) => {
    await postService.deletePost(req.user?._id as string, req.params.postId as string);

    return res.status(StatusCodes.OK).json(ApiResponse.success("Post deleted successfully."));
});

const restorePost = asyncHandler(async (req, res) => {
    await postService.restorePost(req.user?._id as string, req.params.postId as string);

    return res.status(StatusCodes.OK).json(ApiResponse.success("Post activated successfully."));
});

export default {
    createPost,
    generateFileUploadUrl,
    updatePost,
    archivePost,
    deletePost,
    restorePost,
};
