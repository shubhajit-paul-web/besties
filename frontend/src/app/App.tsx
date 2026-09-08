import { useRef, useState } from "react";
import type { AccessTokenPayload, UserType } from "../types/user.types";
import Router from "../routes/routes";
import Context from "./Context";
import type { CallStatus } from "@/types/global.types";
import type { OfferPayload } from "@/features/videoCall/types/videoCall.types";

const App = () => {
	const [user, setUser] = useState<UserType | null>(null);
	const [onlineFriends, setOnlineFriends] = useState<AccessTokenPayload[]>([]);
	const [isVideoCallCameraOn, setIsVideoCallCameraOn] = useState(false);
	const [isVideoCallMicOn, setIsVideoCallMicOn] = useState(false);
	const [isVideoCallScreenSharing, setIsVideoCallScreenSharing] = useState(false);
	const [videoCallStatus, setVideoCallStatus] = useState<CallStatus>("pending");
	const [videoCallDuration, setVideoCallDuration] = useState(0);
	const [videoCallSenderInfo, setVideoCallSenderInfo] = useState<OfferPayload["from"] | null>(null);

	const videoCallRemoteVideoRef = useRef<HTMLVideoElement | null>(null);
	const videoCallLocalVideoRef = useRef<HTMLVideoElement | null>(null);
	const videoCallLocalStreamRef = useRef<MediaStream | null>(null);
	const videoCallLocalAudioRef = useRef<HTMLAudioElement | null>(null);
	const videoCallOfferPayloadRef = useRef<OfferPayload | null>(null);
	const videoCallPeerConnectionRef = useRef<RTCPeerConnection | null>(null);
	const videoCallPendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
	const videoCallStatusRef = useRef<CallStatus>("pending");

	return (
		<Context.Provider
			value={{
				user,
				setUser,
				onlineFriends,
				setOnlineFriends,
				videoCallCommunication: {
					isVideoCallCameraOn,
					setIsVideoCallCameraOn,
					isVideoCallMicOn,
					setIsVideoCallMicOn,
					isVideoCallScreenSharing,
					setIsVideoCallScreenSharing,
					videoCallStatus,
					setVideoCallStatus,
					videoCallDuration,
					setVideoCallDuration,
					videoCallSenderInfo,
					setVideoCallSenderInfo,
					videoCallRemoteVideoRef,
					videoCallLocalVideoRef,
					videoCallLocalStreamRef,
					videoCallLocalAudioRef,
					videoCallOfferPayloadRef,
					videoCallPeerConnectionRef,
					videoCallPendingIceCandidatesRef,
					videoCallStatusRef,
				},
			}}>
			<Router />
		</Context.Provider>
	);
};

export default App;
