import { HttpInterceptor } from "@/lib/axios";

export const generateSignedUrlForFileUploadApi = async (friendId: string, fileType: string) => {
	return HttpInterceptor.post("/messages/file/upload-url", {
		friendId,
		contentType: fileType,
	});
};

export const generateSignedUrlForFileDownloadApi = async (path: string) => {
	return HttpInterceptor.post("/messages/file/download-url", { path });
};
