import type { RefObject, SetStateAction } from "react";
import type { CallStatus } from "./global.types";
import type { OfferPayload } from "@/features/videoCall/types/videoCall.types";
import type { AccessTokenPayload, UserType } from "./user.types";

export type VideoCallCommunication = {
	isVideoCallCameraOn: boolean;
	setIsVideoCallCameraOn: (value: SetStateAction<boolean>) => void;
	isVideoCallMicOn: boolean;
	setIsVideoCallMicOn: (value: SetStateAction<boolean>) => void;
	isVideoCallScreenSharing: boolean;
	setIsVideoCallScreenSharing: (value: SetStateAction<boolean>) => void;
	videoCallStatus: CallStatus;
	setVideoCallStatus: (value: SetStateAction<CallStatus>) => void;
	updateVideoCallStatus: (status: CallStatus) => void;
	videoCallDuration: number;
	setVideoCallDuration: (value: SetStateAction<number>) => void;
	videoCallSenderInfo: OfferPayload["from"] | null;
	setVideoCallSenderInfo: (value: SetStateAction<OfferPayload["from"] | null>) => void;
	videoCallRemoteVideoRef: RefObject<HTMLVideoElement | null>;
	videoCallLocalVideoRef: RefObject<HTMLVideoElement | null>;
	videoCallLocalStreamRef: RefObject<MediaStream | null>;
	videoCallLocalAudioRef: RefObject<HTMLAudioElement | null>;
	videoCallOfferPayloadRef: RefObject<OfferPayload | null>;
	videoCallPeerConnectionRef: RefObject<RTCPeerConnection | null>;
	videoCallPendingIceCandidatesRef: RefObject<RTCIceCandidateInit[]>;
	videoCallStatusRef: RefObject<CallStatus>;
};

export type AppStore = {
	user: UserType | null;
	setUser: (value: SetStateAction<UserType | null>) => void;
	onlineFriends: AccessTokenPayload[];
	setOnlineFriends: (value: SetStateAction<AccessTokenPayload[]>) => void;
	videoCallCommunication: VideoCallCommunication;
};
