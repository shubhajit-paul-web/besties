import { createContext, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { AccessTokenPayload, UserType } from "../types/user.types";
import type { CallStatus } from "@/types/global.types";
import type { OfferPayload } from "@/features/videoCall/types/videoCall.types";

export type VideoCallCommunication = {
	isVideoCallCameraOn: boolean;
	setIsVideoCallCameraOn: Dispatch<SetStateAction<boolean>>;
	isVideoCallMicOn: boolean;
	setIsVideoCallMicOn: Dispatch<SetStateAction<boolean>>;
	isVideoCallScreenSharing: boolean;
	setIsVideoCallScreenSharing: Dispatch<SetStateAction<boolean>>;
	videoCallStatus: CallStatus;
	setVideoCallStatus: Dispatch<SetStateAction<CallStatus>>;
	videoCallDuration: number;
	setVideoCallDuration: Dispatch<SetStateAction<number>>;
	videoCallSenderInfo: OfferPayload["from"] | null;
	setVideoCallSenderInfo: Dispatch<SetStateAction<OfferPayload["from"] | null>>;
	videoCallRemoteVideoRef: RefObject<HTMLVideoElement | null>;
	videoCallLocalVideoRef: RefObject<HTMLVideoElement | null>;
	videoCallLocalStreamRef: RefObject<MediaStream | null>;
	videoCallLocalAudioRef: RefObject<HTMLAudioElement | null>;
	videoCallOfferPayloadRef: RefObject<OfferPayload | null>;
	videoCallPeerConnectionRef: RefObject<RTCPeerConnection | null>;
	videoCallPendingIceCandidatesRef: RefObject<RTCIceCandidateInit[]>;
	videoCallStatusRef: RefObject<CallStatus>;
};

export type ContextType = {
	user: UserType | null;
	setUser: Dispatch<SetStateAction<UserType | null>>;
	onlineFriends: AccessTokenPayload[];
	setOnlineFriends: Dispatch<SetStateAction<AccessTokenPayload[]>>;
	videoCallCommunication: VideoCallCommunication;
};

const Context = createContext<ContextType | null>(null);

export default Context;
