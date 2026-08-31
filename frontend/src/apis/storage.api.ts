import { HttpInterceptor } from "@/lib/axios";

export const uploadFileToS3 = async (url: string, formData: FormData) => {
	return HttpInterceptor.post(url, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
};
