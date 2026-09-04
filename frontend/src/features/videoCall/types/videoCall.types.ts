import type { UserType } from "@/types/user.types";

export type MeetingInfoProps = {
	meetingId?: string;
	sessionLength?: string;
};

export type OfferPayload = {
	from: Pick<UserType, "_id" | "name" | "username" | "avatar">;
	offer: RTCSessionDescription;
};

export type CallStatus = "pending" | "calling" | "incoming" | "talking" | "end";
