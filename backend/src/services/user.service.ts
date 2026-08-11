import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/apiError.js";
import type { SupportedFileType } from "../types/storage/storage.service.js";
import storageService from "./storage.service.js";
import config from "../config/environment.js";

const getCurrentUser = async (userId: string) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");
    }

    return user;
};

const generateAvatarUploadUrl = async (userId: string, type: SupportedFileType) => {
    const result = await storageService.createPresignedPostUpload({
        userId,
        path: "avatars",
        type,
        expires: 120, // 2 minutes
        maxFileSize: 5 * 1024 * 1024, // 5 MB
        acl: "public-read",
    });

    return result;
};

const updateAvatar = async (userId: string, path: string) => {
    await storageService.validateObjectOwnership(userId, path);

    const avatarUrl = `${config.AWS.S3_URL}/${path}`;

    const { matchedCount } = await userRepository.updateAvatarByUserId(userId, avatarUrl);

    if (matchedCount === 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User does not exists.");
    }
};

export default {
    getCurrentUser,
    generateAvatarUploadUrl,
    updateAvatar,
};
