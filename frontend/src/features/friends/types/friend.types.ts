import type { ReactNode } from "react";
import type { UserType } from "../../../types/user.types";

export interface FriendRequest {
	_id: string;
	sender: Pick<UserType, "_id" | "username" | "name" | "avatar">;
	createdAt: Date;
}

export interface FriendListItem {
	friendshipId: string;
	user: Pick<UserType, "_id" | "name" | "avatar">;
}

export interface ProfileCardProps {
	children: ReactNode;
	image: string;
	name: string;
}

export interface ProfileCardsWrapperProps {
	children?: ReactNode;
	title: string;
	totalProfilesCount?: number;
}
