import type { CallStatus } from "@/types/global.types";
import type { UserType } from "@/types/user.types";
import type { ComponentProps, ReactNode } from "react";

export interface VideoParticipantProps extends ComponentProps<"div"> {
	fullName: string;
	isRemote: boolean;
	children: ReactNode;
}

export type VideoStageProps = {
	remoteName: string;
	localName: string;
	isLocalPinned: boolean;
	onSwap: () => void;
};

export type CallControlsProps = {
	callStatus: CallStatus;
	callDuration: number;
	isAudioOn: boolean;
	isVideoOn: boolean;
	isScreenSharing: boolean;
	onToggleMic: () => void;
	onToggleCamera: () => void;
	onToggleScreen: () => void;
	onStartCall: () => void;
	onEndCall: () => void;
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

export type VideoCallStateChangedPayload = {
	from: string;
	video: boolean;
	audio: boolean;
	screenShare: boolean;
};
