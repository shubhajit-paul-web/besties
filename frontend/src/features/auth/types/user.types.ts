export type ProfilePictureFormData = {
	profilePicture?: FileList;
};

export type PresignedPostResponse = {
	url: string;
	fields: Record<string, string>;
};
