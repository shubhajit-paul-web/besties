import { useCallback, useState } from "react";
import { type AxiosProgressEvent } from "axios";
import { toast, type ToastOptions } from "react-toastify";
import type { PresignedPostResponse } from "@/types/s3.types";
import { uploadFileToS3 } from "@/apis/storage.api";
import { generateSignedUrlForFileUploadApi } from "../apis/chat.api";
import getFileUploadErrorMessage from "@/utils/getFileUploadErrorMessage";

const toastPosition: ToastOptions = {
	position: "top-center",
};

export type UploadResult = {
	success: boolean;
	filePath?: string;
	error?: string;
};

/**
 * Custom React hook for handling secure S3 file uploads with live progress tracking.
 *
 * Pipeline:
 * 1. Request presigned S3 POST credentials from the backend.
 * 2. Build the multipart/form-data payload required by S3.
 * 3. Upload the file directly to S3 while tracking progress.
 * 4. Manage upload, success, error, and reset states.
 */
const useUploadFile = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [isUploadSuccess, setIsUploadSuccess] = useState(false);
	const [filePath, setFilePath] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);

	/**
	 * Reset all upload-related states to their initial values.
	 */
	const resetUploadState = useCallback(() => {
		setIsUploading(false);
		setIsUploadSuccess(false);
		setFilePath(null);
		setUploadProgress(0);
	}, []);

	/**
	 * Update upload progress based on the number of bytes uploaded.
	 */
	const onUploadProgressHandler = useCallback((progressEvent: AxiosProgressEvent) => {
		if (!progressEvent.total) return;

		const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);

		setUploadProgress(progress);
	}, []);

	/**
	 * Upload a file directly to S3 using a presigned POST.
	 *
	 * @param friendId ID of the chat participant.
	 * @param file File to upload.
	 * @returns Upload result containing the S3 key on success.
	 */
	const handleUploadFileToS3 = useCallback(
		async (friendId: string, file: File): Promise<UploadResult> => {
			setIsUploading(true);
			setIsUploadSuccess(false);
			setFilePath(null);
			setUploadProgress(0);

			try {
				// Step 1: Request presigned S3 POST credentials.
				const response = await generateSignedUrlForFileUploadApi(friendId, file.type);

				const { url, fields }: PresignedPostResponse = response.data;

				if (!fields.key) {
					throw new Error("Missing S3 object key.");
				}

				// Step 2: Build the multipart payload required by S3.
				const formData = new FormData();

				Object.entries(fields).forEach(([key, value]) => {
					formData.append(key, value);
				});

				formData.append("file", file);

				// Step 3: Upload the file directly to S3.
				await uploadFileToS3({
					url,
					formData,
					onUploadProgressHandler,
				});

				const uploadedKey = fields.key;

				setIsUploadSuccess(true);
				setFilePath(uploadedKey);
				setUploadProgress(100);

				return {
					success: true,
					filePath: uploadedKey,
				};
			} catch (error) {
				const errorMessage = getFileUploadErrorMessage(error);

				toast.error(errorMessage, toastPosition);

				console.error("[useUploadFile] S3 Upload Error:", error);

				return {
					success: false,
					error: errorMessage,
				};
			} finally {
				setIsUploading(false);
			}
		},
		[onUploadProgressHandler],
	);

	return {
		isUploading,
		isUploadSuccess,
		filePath,
		uploadProgress,
		handleUploadFileToS3,
		resetUploadState,
	};
};

export default useUploadFile;
