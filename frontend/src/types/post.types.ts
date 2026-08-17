import type { Author } from "./user.types";

export interface PostMetrics {
	likes: number;
	comments: number;
	shares: number;
}

export interface Post {
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
}

export interface PostComponentProps {
	post: Post;
}
