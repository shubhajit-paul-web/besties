import { HttpInterceptor } from "@/lib/axios";

export const generateSignedUrlForProfilePicApi = async (fileType: string) => {
	return HttpInterceptor.post("/users/me/avatar/upload-url", {
		type: fileType,
	});
};

export const uploadProfilePicToS3 = async (url: string, formData: FormData) => {
	return HttpInterceptor.post(url, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};

export const updateProfilePicUrl = async (key: string) => {
	return HttpInterceptor.put("users/me/avatar", {
		path: key, // fields.key
	});
};
