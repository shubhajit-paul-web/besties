import asyncHandler from "../utils/asyncHandler.js";
import storageService from "../services/storage.service.js";
import { DownloadFileRequest, UploadFileRequest } from "../types/storage/storage.request.js";
import { StatusCodes } from "http-status-codes";

const downloadFile = asyncHandler(async (req: DownloadFileRequest, res) => {
    const { path } = req.body;

    const url = await storageService.downloadFile(path);

    res.status(StatusCodes.OK).json({ url });
});

const uploadFile = asyncHandler(async (req: UploadFileRequest, res) => {
    const { path, type } = req.body;

    const url = await storageService.uploadFile(path, type);

    res.status(StatusCodes.OK).json({ url });
});

export default {
    downloadFile,
    uploadFile,
};
