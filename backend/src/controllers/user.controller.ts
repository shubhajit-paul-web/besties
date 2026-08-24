import asyncHandler from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";
import type {
    GenerateAvatarUploadUrlRequest,
    UpdateAvatarRequest,
} from "../types/user/user.request.js";

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

    return res.status(StatusCodes.OK).json(result);
});

const updateAvatar = asyncHandler(async (req: UpdateAvatarRequest, res) => {
    await userService.updateAvatar(req.user?._id as string, req.body.path);

    res.status(StatusCodes.OK).json(ApiResponse.success("Avatar updated successfully."));
});

const getUserProfile = asyncHandler(async (req, res) => {
    const user = await userService.getUserProfile(req.params.id as string);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("User profile fetched successfully", user));
});

export default {
    getCurrentUser,
    generateAvatarUploadUrl,
    updateAvatar,
    getUserProfile,
};
