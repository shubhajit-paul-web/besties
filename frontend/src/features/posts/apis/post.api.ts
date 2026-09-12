import { HttpInterceptor } from "@/lib/axios";

export const generateSignedUrlForFileUploadApi = async (contentType: string) => {
	return HttpInterceptor.post("/posts/file/upload-url", {
		contentType,
	});
};
