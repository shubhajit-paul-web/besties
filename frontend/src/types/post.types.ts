import type { Author } from "./user.types";

export type PostMetrics = {
	likes: number;
	comments: number;
	shares: number;
};

export type PostFile = {
	path: string | null;
	contentType: string;
};

export type Post = {
	_id: string;
	author: Author;
	createdAt: string;
	content?: string | undefined;
	files: PostFile[];
	visibility: "public" | "friends" | "private";
	metrics: PostMetrics;
	user: {
		_id: string;
		name: { first: string; last?: string };
		avatar?: string;
	};

	// User-specific state (contextual to the logged-in viewer)
	isLiked: boolean;
	isSaved: boolean;
	isOwner: boolean;
};

export type PostComponentProps = {
	post: Post;
	currentUserId: string;
};
