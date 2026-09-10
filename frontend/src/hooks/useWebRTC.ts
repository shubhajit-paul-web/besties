import socket from "@/lib/socket";
import useAppContext from "./useAppContext";

// RTCPeerConnection, ICE buffering, and sockets
const useWebRTC = () => {
	const { videoCallCommunication } = useAppContext();

	const {
		videoCallRemoteVideoRef: remoteVideoRef,
		videoCallRemoteStreamRef: remoteStreamRef,
		videoCallLocalStreamRef: localStreamRef,
		videoCallPeerConnectionRef: peerConnectionRef,
		videoCallLocalVideoRef: localVideoRef,
		videoCallOfferPayloadRef: offerPayloadRef,
		videoCallPendingIceCandidatesRef: pendingIceCandidatesRef,
		setIsVideoCallCameraOn: setIsCameraOn,
		setIsVideoCallMicOn: setIsMicOn,
		setIsVideoCallScreenSharing: setIsScreenSharing,
		updateVideoCallStatus: updateCallStatus,
		videoCallSenderInfo,
	} = videoCallCommunication;

	// Clean up the call and reset all related resources
	const cleanupVideoCall = () => {
		const pc = peerConnectionRef.current;

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
		pc?.close();
		peerConnectionRef.current = null;
		offerPayloadRef.current = null;
		pendingIceCandidatesRef.current = [];

		// Clear video elements
		if (localVideoRef.current) {
			localVideoRef.current.srcObject = null;
		}
		if (remoteVideoRef.current) {
			remoteVideoRef.current.srcObject = null;
		}
		remoteStreamRef.current = null;
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

		const videoSender = peerConnection.addTransceiver("video", {
			direction: "sendrecv",
		}).sender;
		const audioSender = peerConnection.addTransceiver("audio", {
			direction: "sendrecv",
		}).sender;

		peerConnection.onicecandidate = (event) => {
			if (event.candidate) {
				socket.emit("call:video:ice-candidate", {
					to: friendId,
					candidate: event.candidate,
				});
			}
		};

		peerConnection.onconnectionstatechange = () => {
			const state = peerConnection.connectionState;

			if (state === "connected") {
				updateCallStatus("connected");
			} else if (state === "closed" || state === "disconnected") {
				updateCallStatus("ended");
			}
		};

		peerConnection.ontrack = (event) => {
			console.log("ontrack fired:", event.track.kind);

			let remoteStream = remoteStreamRef.current;

			if (!remoteStream) {
				remoteStream = new MediaStream();
				remoteStreamRef.current = remoteStream;
			}

			// Avoid adding the same track twice
			if (!remoteStream.getTracks().includes(event.track)) {
				remoteStream.addTrack(event.track);
			}

			console.log("Remote tracks:", remoteStream.getTracks());

			const remoteVideoElement = remoteVideoRef.current;

			if (remoteVideoElement) {
				remoteVideoElement.srcObject = remoteStream;
			}
		};

		const localStream = localStreamRef.current;

		if (localStream) {
			localStream.getTracks().forEach((track) => {
				const sender = track.kind === "audio" ? audioSender : videoSender;
				sender.replaceTrack(track);
			});
		}

		peerConnectionRef.current = peerConnection;
	};

	return { initiateWebRtcConnection, cleanupVideoCall };
};

export default useWebRTC;
