import socket from "@/lib/socket";
import type { CallStatus } from "@/types/global.types";
import type { RefObject } from "react";

type UsePeerConnectionProps = {
	friendId: string | undefined;
	remoteVideoRef: RefObject<HTMLVideoElement | null>;
	localStreamRef: RefObject<MediaStream | null>;
	peerConnectionRef: RefObject<RTCPeerConnection | null>;
	updateCallStatus: (state: CallStatus) => void;
};

// RTCPeerConnection, ICE buffering, and sockets
const useWebRTC = ({ friendId, remoteVideoRef, localStreamRef, peerConnectionRef, updateCallStatus }: UsePeerConnectionProps) => {
	const webRtcConnection = () => {
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

	return webRtcConnection;
};

export default useWebRTC;
