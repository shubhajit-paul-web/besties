import type { CreatePostPayload } from "../types/createPost.types";

export const createPost = async (payload: CreatePostPayload) => {
	void payload;
	await new Promise((resolve) => setTimeout(resolve, 650));
};
