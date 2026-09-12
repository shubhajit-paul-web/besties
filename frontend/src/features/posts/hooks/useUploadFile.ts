import { useCallback, useState } from "react";
import { toast, type ToastOptions } from "react-toastify";
import { uploadFileToS3 } from "@/apis/storage.api";
import type { PresignedPostResponse } from "@/types/s3.types";
import { generateSignedUrlForFileUploadApi } from "../apis/post.api";
import getFileUploadErrorMessage from "@/utils/getFileUploadErrorMessage";

const TOAST_OPTIONS: ToastOptions = {
	position: "top-center",
};

export type UploadResult = {
	success: boolean;
	keys?: string[];
	error?: string;
};

/**
 * Custom hook for batch uploading files directly to S3 via presigned POST URLs.
 */
const useUploadFiles = () => {
	const [isUploading, setIsUploading] = useState(false);
	const [isUploadSuccess, setIsUploadSuccess] = useState(false);

	const resetUploadState = useCallback(() => {
		setIsUploading(false);
		setIsUploadSuccess(false);
	}, []);

	/**
	 * Handles the two-step upload lifecycle for an array of files:
	 * 1. Requests presigned POST URLs from the backend.
	 * 2. Direct-uploads binaries to S3 using FormData.
	 */
	const uploadFiles = useCallback(async (files: File[]): Promise<UploadResult> => {
		setIsUploading(true);
		setIsUploadSuccess(false);

		try {
			// Step 1: Request presigned POST credentials for each file type concurrently
			const responses = await Promise.all(files.map((file) => generateSignedUrlForFileUploadApi(file.type)));

			const signedUrls = responses.map((response): PresignedPostResponse => response.data);

			// Step 2: Upload each file directly to S3 concurrently
			const uploadedFileKeys = await Promise.all(
				signedUrls.map(async ({ url, fields }, index) => {
					const file = files[index];

					if (!file) {
						throw new Error(`File not found at index ${index}`);
					}

					if (!fields.key) {
						throw new Error(`Missing S3 key at index ${index}`);
					}

					const formData = new FormData();

					Object.entries(fields).forEach(([key, value]) => {
						formData.append(key, value);
					});

					formData.append("file", file);

					await uploadFileToS3({
						url,
						formData,
					});

					return fields.key;
				}),
			);

			setIsUploadSuccess(true);

			return {
				success: true,
				keys: uploadedFileKeys,
			};
		} catch (error) {
			const errorMessage = getFileUploadErrorMessage(error);

			toast.error(errorMessage, TOAST_OPTIONS);

			console.error("[useUploadFiles] Upload failed:", error);

			return {
				success: false,
				error: errorMessage,
			};
		} finally {
			setIsUploading(false);
		}
	}, []);

	return {
		isUploading,
		isUploadSuccess,
		uploadFiles,
		resetUploadState,
	};
};

export default useUploadFiles;
