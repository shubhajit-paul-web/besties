import type { ReactNode } from "react";
import type { UserType } from "../../../types/user.types";

export type FriendRequest = {
	_id: string;
	sender: Pick<UserType, "_id" | "username" | "name" | "avatar">;
	createdAt: Date;
};

export type FriendListItem = {
	friendshipId: string;
	user: Pick<UserType, "_id" | "name" | "avatar">;
};

export type ProfileCardProps = {
	children: ReactNode;
	image: string;
	name: string;
};

export type ProfileCardsWrapperProps = {
	children?: ReactNode;
	title: string;
	totalProfilesCount?: number;
};
