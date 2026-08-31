import { useState } from "react";
import type { AxiosResponse } from "axios";
import type { PresignedPostResponse } from "@/types/s3.types";
import { generateSignedUrlForFileUploadApi } from "../apis/chat.api";
import { uploadFileToS3 } from "@/apis/storage.api";
import { toast, type ToastOptions } from "react-toastify";
import axios from "axios";

const toastPosition: ToastOptions = {
	position: "top-center",
};

const useUploadFile = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleUploadFileToS3 = (friendId: string, file: File) => {
		setIsSubmitting(true);

		const formData = new FormData();

		// Step 1 - Generate signed upload url
		generateSignedUrlForFileUploadApi(friendId, file.type)
			.then(async (res: AxiosResponse<PresignedPostResponse>) => {
				const { fields, url } = res.data;

				Object.entries(fields).forEach(([key, value]) => {
					formData.append(key, value);
				});

				formData.append("Content-Type", file.type);
				formData.append("file", file);

				try {
					// Step 2 - Upload the file to s3
					await uploadFileToS3(url, formData);
				} catch (err) {
					if (axios.isAxiosError(err)) {
						switch (err.response?.status) {
							case 403:
								toast.error("Upload rejected. Please check the file type or size.", toastPosition);
								break;

							case 413:
								toast.error("File is too large.", toastPosition);
								break;

							default:
								toast.error("Failed to upload file.", toastPosition);
						}
					}
				}
			})
			.catch((err) => {
				toast.error("Failed to upload file.", toastPosition);

				console.error(err);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	return { isSubmitting, handleUploadFileToS3 };
};

export default useUploadFile;
