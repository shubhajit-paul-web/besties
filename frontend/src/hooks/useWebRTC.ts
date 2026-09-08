import socket from "@/lib/socket";
import useAppContext from "./useAppContext";

// type UsePeerConnectionProps = {
// 	friendId: string | undefined;
// 	remoteVideoRef: RefObject<HTMLVideoElement | null>;
// 	localStreamRef: RefObject<MediaStream | null>;
// 	peerConnectionRef: RefObject<RTCPeerConnection | null>;
// 	updateCallStatus: (state: CallStatus) => void;
// };

// RTCPeerConnection, ICE buffering, and sockets
const useWebRTC = () => {
	const { videoCallCommunication } = useAppContext();

	const {
		videoCallRemoteVideoRef: remoteVideoRef,
		videoCallLocalStreamRef: localStreamRef,
		videoCallPeerConnectionRef: peerConnectionRef,
		videoCallLocalVideoRef: localVideoRef,
		setIsVideoCallCameraOn: setIsCameraOn,
		setIsVideoCallMicOn: setIsMicOn,
		setIsVideoCallScreenSharing: setIsScreenSharing,
		updateVideoCallStatus: updateCallStatus,
		videoCallSenderInfo,
	} = videoCallCommunication;

	// Clean up the call and reset all related resources
	const cleanupVideoCall = () => {
		const pc = peerConnectionRef.current;
		if (!pc) return;

		// Stop local media tracks
		const localStream = localStreamRef.current;

		if (localStream) {
			localStream.getTracks().forEach((track) => {
				track.stop();
			});

			localStreamRef.current = null;
		}

		// Reset all local media sharing states
		setIsCameraOn(false);
		setIsMicOn(false);
		setIsScreenSharing(false);

		// Close peer connection
		pc.close();
		peerConnectionRef.current = null;

		// Clear video elements
		if (localVideoRef.current) {
			localVideoRef.current.srcObject = null;
		}
		if (remoteVideoRef.current) {
			remoteVideoRef.current.srcObject = null;
		}
	};

	const initiateWebRtcConnection = (friendId?: string) => {
		friendId = friendId ?? videoCallSenderInfo?._id;

		if (!friendId) {
			throw new Error("Friend id is required");
		}

		const peerConnection = new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
				},
			],
		});

		peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				socket.emit("ice-candidate", {
					to: friendId,
					candidate: event.candidate,
				});
			}
		};

		peerConnection.onconnectionstatechange = () => {
			const connectionState = peerConnection.connectionState;

			if (connectionState === "connected") {
				updateCallStatus("connected");
			} else if (connectionState === "closed" || connectionState === "disconnected") {
				updateCallStatus("ended");
			}
		};

		peerConnection.ontrack = (event) => {
			console.log("On track fired");

			const remoteVideoElement = remoteVideoRef.current;
			if (!remoteVideoElement) return;

			const remoteStream = event.streams[0];

			remoteVideoElement.srcObject = remoteStream;
		};

		const localStream = localStreamRef.current;

		if (localStream) {
			localStream.getTracks().forEach((track) => {
				peerConnection.addTrack(track, localStream);
			});
		}

		// return peerConnection;
		peerConnectionRef.current = peerConnection;
	};

	return { initiateWebRtcConnection, cleanupVideoCall };
};

export default useWebRTC;
