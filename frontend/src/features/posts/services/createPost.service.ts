import type { CreatePostPayload } from "../types/createPost.types";

export const createPost = async (payload: CreatePostPayload) => {
	console.log(payload);
	await new Promise((resolve) => setTimeout(resolve, 650));
};
