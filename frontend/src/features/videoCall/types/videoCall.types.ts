import type { UserType } from "@/types/user.types";

type Sender = Pick<UserType, "_id" | "name" | "username" | "avatar">;

export type MeetingInfoProps = {
	meetingId?: string;
	sessionLength?: string;
};

export type OfferPayload = {
	from: Sender;
	offer: RTCSessionDescriptionInit;
};

export type AnswerPayload = {
	from: Sender;
	answer: RTCSessionDescriptionInit;
};

export type ICECandidatePayload = {
	to: string;
	candidate: RTCIceCandidateInit;
};

export type CallStatus = "pending" | "calling" | "incoming" | "talking" | "end";
