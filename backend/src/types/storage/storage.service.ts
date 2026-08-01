import { SUPPORTED_FILE_TYPES } from "../../constants/constants.js";

export type SupportedFileType = (typeof SUPPORTED_FILE_TYPES)[number];

export type CreatePresignedPostUpload = {
    userId: string;
    path: string;
    type: SupportedFileType;
    expires: number;
    maxFileSize: number;
};
