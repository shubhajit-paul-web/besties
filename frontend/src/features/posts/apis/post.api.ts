import { HttpInterceptor } from "@/lib/axios";
import type { CreatePostPayload } from "../types/post.types";

export const generateSignedUrlForFileUploadApi = async (contentType: string) => {
	return HttpInterceptor.post("/posts/file/upload-url", {
		contentType,
	});
};

export const createPostApi = async (payload: CreatePostPayload) => {
	return HttpInterceptor.post("/posts", payload);
};
