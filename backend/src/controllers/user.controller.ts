import asyncHandler from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";
import type { GenerateAvatarUploadUrlRequest } from "../types/user/user.request.js";

const getCurrentUser = asyncHandler(async (req, res) => {
    const user = await userService.getCurrentUser(req.user?._id as string);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("User profile fetched successfully.", { user }));
});

const generateAvatarUploadUrl = asyncHandler(async (req: GenerateAvatarUploadUrlRequest, res) => {
    const result = await userService.generateAvatarUploadUrl(
        req.user?._id as string,
        req.body.type,
    );

    return res.status(StatusCodes.OK).json({
        upload: result,
    });
});

export default {
    getCurrentUser,
    generateAvatarUploadUrl,
};
