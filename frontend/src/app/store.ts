import { create } from "zustand";
import type { RefObject, SetStateAction } from "react";
import type { CallStatus } from "@/types/global.types";
import type { OfferPayload } from "@/features/videoCall/types/videoCall.types";
import type { AppStore, VideoCallCommunication } from "@/types/context.types";

const resolveStateAction = <T>(value: SetStateAction<T>, currentValue: T) => {
	/* 
        Zustand does not evaluate React's functional SetStateAction, 
        so resolve it here before storing the new value.
    */
	if (typeof value === "function") {
		return (value as (previousValue: T) => T)(currentValue);
	}

	return value;
};

const createRef = <T>(current: T) => ({ current }) as RefObject<T>;

const useAppStore = create<AppStore>((set) => {
	const updateVideoCallState = <K extends keyof VideoCallCommunication>(key: K, value: SetStateAction<VideoCallCommunication[K]>) => {
		/* 
            Update one communication value while keeping the rest of the nested
		    object available to components that read the video-call store. 
        */
		set((state) => ({
			videoCallCommunication: {
				...state.videoCallCommunication,
				[key]: resolveStateAction(value, state.videoCallCommunication[key]),
			},
		}));
	};

	return {
		user: null,
		setUser: (value) => set((state) => ({ user: resolveStateAction(value, state.user) })),
		onlineFriends: [],
		setOnlineFriends: (value) => set((state) => ({ onlineFriends: resolveStateAction(value, state.onlineFriends) })),

		/* Video call communication */
		videoCallCommunication: {
			videoCallRemoteMediaState: {
				video: false,
				audio: false,
				screenShare: false,
			},
			setVideoCallRemoteMediaState: (value) => updateVideoCallState("videoCallRemoteMediaState", value),
			isVideoCallCameraOn: false,
			setIsVideoCallCameraOn: (value) => updateVideoCallState("isVideoCallCameraOn", value),
			isVideoCallMicOn: false,
			setIsVideoCallMicOn: (value) => updateVideoCallState("isVideoCallMicOn", value),
			isVideoCallScreenSharing: false,
			setIsVideoCallScreenSharing: (value) => updateVideoCallState("isVideoCallScreenSharing", value),
			videoCallStatus: "pending",
			setVideoCallStatus: (value) => updateVideoCallState("videoCallStatus", value),
			updateVideoCallStatus: (status) =>
				set((state) => {
					state.videoCallCommunication.videoCallStatusRef.current = status;
					return {
						videoCallCommunication: {
							...state.videoCallCommunication,
							videoCallStatus: status,
						},
					};
				}),
			videoCallDuration: 0,
			setVideoCallDuration: (value) => updateVideoCallState("videoCallDuration", value),
			videoCallSenderInfo: null,
			setVideoCallSenderInfo: (value) => updateVideoCallState("videoCallSenderInfo", value),

			/* 
                These refs keep DOM nodes and WebRTC objects shared across call
			    handlers without putting mutable connection state into rerenders.
            */
			videoCallRemoteVideoRef: createRef<HTMLVideoElement | null>(null),
			videoCallRemoteStreamRef: createRef<MediaStream | null>(null),
			videoCallLocalVideoRef: createRef<HTMLVideoElement | null>(null),
			videoCallLocalStreamRef: createRef<MediaStream | null>(null),
			videoCallLocalAudioRef: createRef<HTMLAudioElement | null>(null),
			videoCallOfferPayloadRef: createRef<OfferPayload | null>(null),
			videoCallPeerConnectionRef: createRef<RTCPeerConnection | null>(null),

			/* 
                ICE candidates can arrive before the remote description is set
			    keep them here until the peer connection is ready to accept them. 
            */
			videoCallPendingIceCandidatesRef: createRef<RTCIceCandidateInit[]>([]),
			videoCallStatusRef: createRef<CallStatus>("pending"),
		},
	};
});

export default useAppStore;
