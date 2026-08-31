import type { AxiosProgressEvent } from "axios";

export type PresignedPostResponse = {
	url: string;
	fields: Record<string, string>;
};

export type UploadFileToS3 = {
	url: string;
	formData: FormData;
	onUploadProgressHandler?: (progressEvent: AxiosProgressEvent) => void;
};
