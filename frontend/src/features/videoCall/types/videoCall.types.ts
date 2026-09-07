import type { UserType } from "@/types/user.types";
import type { ComponentProps, ReactNode, RefObject } from "react";

export interface VideoParticipantProps extends ComponentProps<"div"> {
	fullName: string;
	children: ReactNode;
}

export type VideoStageProps = {
	remoteVideoRef: RefObject<HTMLVideoElement | null>;
	localVideoRef: RefObject<HTMLVideoElement | null>;
	localAudioRef: RefObject<HTMLAudioElement | null>;
	remoteName: string;
	localName: string;
	isLocalPinned: boolean;
	onSwap: () => void;
};

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

export type CallStatus = "pending" | "calling" | "incoming" | "rejected" | "connected" | "canceled" | "faild" | "ended";
