export interface ProfilePictureFormData {
	profilePicture?: FileList;
}

export interface PresignedPostResponse {
	url: string;
	fields: Record<string, string>;
}
