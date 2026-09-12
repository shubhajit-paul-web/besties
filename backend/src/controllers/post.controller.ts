import { StatusCodes } from "http-status-codes";
import postService from "../services/post.service.js";
import { createPostRequest } from "../types/post/post.request.js";
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

export default {
    createPost,
    generateFileUploadUrl,
};
