import { useState, useCallback } from "react";
import type { AxiosProgressEvent, AxiosResponse } from "axios";
import type { PresignedPostResponse } from "@/types/s3.types";
import { generateSignedUrlForFileUploadApi } from "../apis/chat.api";
import { uploadFileToS3 } from "@/apis/storage.api";
import { toast, type ToastOptions } from "react-toastify";
import axios from "axios";

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
 * 1. Request a presigned S3 POST policy and credentials from backend API.
 * 2. Upload file directly to S3 via multipart/form-data while monitoring real-time upload progress.
 * 3. Gracefully manage loading, success/error states, and expose reset helpers.
 */
const useUploadFile = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [isUploadSuccess, setIsUploadSuccess] = useState(false);
	const [filePath, setFilePath] = useState<string | null>(null);
	const [uploadProgress, setUploadProgress] = useState(0);

	/**
	 * Reset all upload-related states to initial defaults.
	 * Useful when opening a new attachment modal or cleaning up after dismissal.
	 */
	const resetUploadState = useCallback(() => {
		setIsUploading(false);
		setIsUploadSuccess(false);
		setFilePath(null);
		setUploadProgress(0);
	}, []);

	/**
	 * Calculate percentage of bytes uploaded and update state smoothly.
	 */
	const onUploadProgressHandler = (progressEvent: AxiosProgressEvent) => {
		if (!progressEvent.total) return;

		const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
		setUploadProgress(progress);
	};

	/**
	 * Main upload executor.
	 * @param friendId ID of the chat participant for secure bucket path isolation.
	 * @param file The browser File object to upload.
	 * @returns Promise resolving to { success, filePath, error }
	 */
	const handleUploadFileToS3 = async (friendId: string, file: File): Promise<UploadResult> => {
		setIsUploading(true);
		setUploadProgress(0);
		setIsUploadSuccess(false);
		setFilePath(null);

		try {
			// Step 1: Request pre-signed POST credentials from backend
			const res: AxiosResponse<PresignedPostResponse> = await generateSignedUrlForFileUploadApi(friendId, file.type);

			const { fields, url } = res.data;

			// Step 2: Build multipart payload matching S3 signature expectations
			const formData = new FormData();

			Object.entries(fields).forEach(([key, value]) => {
				formData.append(key, value);
			});

			formData.append("file", file);

			// Step 3: Stream file directly to S3 bucket with Axios progress tracking
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
		} catch (err) {
			let errorMessage = "Failed to upload file. Please try again.";

			if (axios.isAxiosError(err)) {
				switch (err.response?.status) {
					case 403:
						errorMessage = "Upload rejected. Please check the file type or permissions.";
						break;
					case 413:
						errorMessage = "File is too large for upload.";
						break;
					default:
						errorMessage = err.response?.data?.message || "Failed to upload file.";
				}
			}

			toast.error(errorMessage, toastPosition);
			console.error("[useUploadFile] S3 Upload Error:", err);

			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setIsUploading(false);
		}
	};

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
