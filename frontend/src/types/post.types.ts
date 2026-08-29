import type { Author } from "./user.types";

export type PostMetrics = {
	likes: number;
	comments: number;
	shares: number;
};

export type Post = {
	id: string;
	author: Author;
	createdAt: string;
	caption?: string | undefined;
	mediaUrl?: string | undefined;
	metrics: PostMetrics;

	// User-specific state (contextual to the logged-in viewer)
	isLiked: boolean;
	isSaved: boolean;
	isOwner: boolean;
};

export type PostComponentProps = {
	post: Post;
};
