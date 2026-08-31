import type { UploadFileToS3 } from "@/types/s3.types";
import type { AxiosRequestConfig } from "axios";
import { HttpInterceptor } from "@/lib/axios";

export const uploadFileToS3 = async ({ url, formData, onUploadProgressHandler }: UploadFileToS3) => {
	const requestConfig: AxiosRequestConfig = {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	};

	if (onUploadProgressHandler) {
		requestConfig.onUploadProgress = onUploadProgressHandler;
	}

	return HttpInterceptor.post(url, formData, requestConfig);
};
