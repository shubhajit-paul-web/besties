import { GetObjectCommand, HeadObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import config from "../config/environment.js";
import s3 from "../config/s3.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import getErrorMessage from "../utils/getErrorMessage.js";
import { v4 as uuid } from "uuid";
import { FILE_TYPE_EXTENSIONS } from "../constants/constants.js";
import type { SupportedFileType } from "../types/storage/storage.service.js";

const isFileExists = async (path: string) => {
    try {
        const command = new HeadObjectCommand({
            Bucket: config.AWS.BUCKET_NAME,
            Key: path,
        });

        await s3.send(command);

        return true;
    } catch {
        return false;
    }
};

const downloadFile = async (path: string) => {
    if (!path) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "File path is required.");
    }

    const isExists = await isFileExists(path);

    if (!isExists) {
        throw new ApiError(StatusCodes.NOT_FOUND, "File not found.");
    }

    try {
        const command = new GetObjectCommand({
            Bucket: config.AWS.BUCKET_NAME,
            Key: path,
        });

        const url = await getSignedUrl(s3, command, {
            expiresIn: 60, // 60 seconds
        });

        return url;
    } catch (err) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to generate a pre-signed download URL.",
            false,
            { details: getErrorMessage(err) },
        );
    }
};

const uploadFile = async (path: string, type: SupportedFileType) => {
    // if (!path || !type) {
    //     throw new ApiError(StatusCodes.BAD_REQUEST, "Both file path and type are required.");
    // }

    const isFileAlreadyExists = await isFileExists(path);

    if (isFileAlreadyExists) {
        throw new ApiError(StatusCodes.CONFLICT, "A file already exists at the specified path.");
    }

    try {
        const Key = `${path}/${uuid()}.${FILE_TYPE_EXTENSIONS[type]}`;

        const command = new PutObjectCommand({
            Bucket: config.AWS.BUCKET_NAME,
            Key,
            ContentType: type,
        });

        const url = await getSignedUrl(s3, command, {
            expiresIn: 60, // 60 seconds
        });

        return url;
    } catch (err) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to generate a pre-signed upload URL.",
            false,
            { details: getErrorMessage(err) },
        );
    }
};

export default {
    downloadFile,
    uploadFile,
};
