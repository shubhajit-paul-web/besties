/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { PhoneOff, Video } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import VideoStage from "../components/VideoStage";
import formatUserName from "@/utils/formatUserName";
import IconControlButton from "@/components/ui/Button/IconControlButton";
import { toast } from "react-toastify";
import socket from "@/lib/socket";
import { useParams } from "react-router-dom";
import { Avatar, notification } from "antd";
import type { AnswerPayload, ICECandidatePayload, OfferPayload } from "../types/videoCall.types";
import type { CallStatus } from "@/types/global.types";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { showErrorToast } from "../utils/toast";
import useWebRTC from "@/hooks/useWebRTC";
import useLocalMedia from "../hooks/useLocalMedia";
import useRingtone from "../hooks/useRingtone";
import CallControls from "../components/CallControls";

const VideoCall = () => {
	const { user: currentUser } = useCurrentUser();
	const { friendId } = useParams();
	const [notify, notifyUi] = notification.useNotification();

	const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
	const localVideoRef = useRef<HTMLVideoElement | null>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const localAudioRef = useRef<HTMLAudioElement | null>(null);
	const offerPayloadRef = useRef<OfferPayload | null>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
	const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
	const callStatusRef = useRef<CallStatus>("pending");

	const [isLocalVideoSharing, setIsLocalVideoSharing] = useState(false);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isAudioSharing, setIsAudioSharing] = useState(false);
	const [callStatus, setCallStatus] = useState<CallStatus>("pending");
	const [callDuration, setCallDuration] = useState(0);
	const [senderInfo, setSenderInfo] = useState<OfferPayload["from"] | null>(null);
	const [isLocalPinned, setIsLocalPinned] = useState(false);

	const { data: friendProfileRes } = useSWR(friendId ? `/users/${friendId}` : null, fetcher);

	const friendInfo = friendProfileRes?.data ?? {};

	const updateCallStatus = (status: CallStatus) => {
		callStatusRef.current = status;
		setCallStatus(status);
	};

	// WebRTC connection initiator
	const initiateWebRtcConnection = useWebRTC({
		friendId,
		remoteVideoRef,
		localStreamRef,
		peerConnectionRef,
		updateCallStatus,
	});

	const { toggleVideoSharing, toggleScreenSharing, toggleAudioSharing } = useLocalMedia({ localVideoRef, localAudioRef });

	const { playRingtone, stopRingtone } = useRingtone();

	// Pause ringing audio and destroy the notification UI
	const removeNotification = (notificationKey: string, shouldStopRingtone: boolean = true) => {
		if (shouldStopRingtone) {
			stopRingtone();
		}

		notify.destroy(notificationKey);
	};

	// Clean up the call and reset all related resources
	const cleanupCall = () => {
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
		setIsLocalVideoSharing(false);
		setIsAudioSharing(false);
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

	const cancelOutgoingCall = () => {
		if (callStatusRef.current !== "calling") return;

		socket.emit("cancel-call", {
			to: friendId,
		});

		updateCallStatus("canceled");

		// Clean up the call and reset all related resources
		cleanupCall();
	};

	const rejectIncomingCall = () => {
		if (callStatusRef.current !== "incoming") return;

		socket.emit("cancel-call", {
			to: offerPayloadRef.current?.from._id,
		});

		updateCallStatus("rejected");

		offerPayloadRef.current = null;
	};

	const acceptIncomingCall = async () => {
		const offerPayload = offerPayloadRef.current;
		if (!offerPayload) return;

		if (!isLocalVideoSharing && !isScreenSharing && !isAudioSharing) {
			const mediaStarted = await toggleVideoSharing();

			if (!mediaStarted) {
				updateCallStatus("faild");
				return;
			}
		}

		if (!localStreamRef.current) return;

		try {
			initiateWebRtcConnection();

			const pc = peerConnectionRef.current;

			if (!pc) {
				throw new Error("Failed to initialize peer connection");
			}

			await pc.setRemoteDescription(offerPayload.offer);

			for (const candidate of pendingIceCandidatesRef.current) {
				await pc.addIceCandidate(candidate);
			}

			pendingIceCandidatesRef.current = [];

			const answer = await pc.createAnswer();
			await pc.setLocalDescription(answer);

			if (!pc.localDescription) {
				throw new Error("Failed to create local description");
			}

			socket.emit("answer", {
				to: offerPayload.from._id,
				answer: pc.localDescription,
			});

			offerPayloadRef.current = null;
		} catch (err: unknown) {
			console.error("Failed to accept incoming call:", err);

			// removeNotification("incoming-call");

			// clean up the partially created WebRTC connection
			peerConnectionRef.current?.close();
			peerConnectionRef.current = null;

			updateCallStatus("faild");
			showErrorToast("Unable to connect the call. Please try again.");
		}
	};

	const startCall = async () => {
		// Make sure at least one media type is available.
		if (!isLocalVideoSharing && !isScreenSharing && !isAudioSharing) {
			const mediaStarted = await toggleVideoSharing();

			if (!mediaStarted) {
				updateCallStatus("faild");
				return;
			}
		}

		try {
			initiateWebRtcConnection();

			const pc = peerConnectionRef.current;

			if (!pc) {
				throw new Error("Failed to initialize peer connection");
			}

			const offer = await pc.createOffer();
			await pc.setLocalDescription(offer);

			if (!pc.localDescription) {
				throw new Error("Failed to create local description");
			}

			socket.emit("offer", {
				to: friendId,
				offer: pc.localDescription,
			});

			updateCallStatus("calling");
		} catch (err: unknown) {
			console.error("Failed to start call:", err);

			updateCallStatus("faild");

			showErrorToast("Unable to start the call. Please try again.");
		}
	};

	const endCall = () => {
		if (callStatusRef.current !== "connected") return;

		socket.emit("end-call", {
			to: friendId,
		});

		updateCallStatus("ended");
		cleanupCall();
	};

	// Socket.io handlers
	const onOfferListener = async (payload: OfferPayload) => {
		try {
			offerPayloadRef.current = payload;
			setSenderInfo(payload.from);
			updateCallStatus("incoming");
		} catch (err: unknown) {
			console.error(err);
		}
	};

	const onAnswerListener = async (payload: AnswerPayload) => {
		const pc = peerConnectionRef.current;
		if (!pc) return;

		try {
			await pc.setRemoteDescription(payload.answer);
		} catch (err: unknown) {
			console.error(err);
		}
	};

	const onIceCandidateListener = async (payload: ICECandidatePayload) => {
		const pc = peerConnectionRef.current;

		if (!pc || !pc.remoteDescription) {
			pendingIceCandidatesRef.current.push(payload.candidate);
			return;
		}

		try {
			await pc.addIceCandidate(payload.candidate);
		} catch (err: unknown) {
			console.error("Failed to add ICE candidate:", err);
		}
	};

	const onCancelCallListener = () => {
		if (callStatusRef.current === "calling") {
			toast.info("Call declined", {
				theme: "colored",
			});

			playRingtone("canceled", false);

			// change the call status after 1 seconds let the audio play
			setTimeout(() => {
				updateCallStatus("rejected");
			}, 1000);

			// Clean up the call and reset all related resources
			cleanupCall();
		} else if (callStatusRef.current === "incoming") {
			updateCallStatus("rejected");
		}
	};

	const onEndCallListener = ({ from }: { from: string }) => {
		if (from === friendId) {
			cleanupCall();
			updateCallStatus("ended");
		}
	};

	// Socket.io listeners
	useEffect(() => {
		socket.on("offer", onOfferListener);
		socket.on("answer", onAnswerListener);
		socket.on("ice-candidate", onIceCandidateListener);
		socket.on("cancel-call", onCancelCallListener);
		socket.on("end-call", onEndCallListener);

		return () => {
			socket.off("offer", onOfferListener);
			socket.off("answer", onAnswerListener);
			socket.off("ice-candidate", onIceCandidateListener);
			socket.off("cancel-call", onCancelCallListener);
			socket.off("end-call", onEndCallListener);
		};
	}, []);

	useEffect(() => {
		if (callStatus === "pending") return;

		if (callStatus === "calling") {
			playRingtone("calling");

			notify.open({
				// title: "Calling...",
				key: "outgoing-call",
				description: (
					<div className="flex items-center gap-3 mt-1">
						<Avatar size={44} src={friendInfo?.avatar ?? "/profile-img.jpeg"} />

						<div className="min-w-0">
							<div className="font-medium truncate">{friendInfo?.username}</div>

							<div className="text-gray-500 text-sm">Calling...</div>
						</div>
					</div>
				),
				duration: 30,
				showProgress: true,
				pauseOnHover: false,
				placement: "topRight",
				closable: false,
				actions: <IconControlButton activeIcon={PhoneOff} inActiveIcon={PhoneOff} onClick={cancelOutgoingCall} />,
				onClose: stopRingtone,
			});
		} else if (callStatus === "incoming") {
			playRingtone("incoming");

			notify.open({
				key: "incoming-call",
				title: "Incoming video call",
				description: (
					<div className="flex items-center gap-3 mt-1">
						<Avatar size={44} src={senderInfo?.avatar ?? "/profile-img.jpeg"} />

						<div className="min-w-0">
							<div className="font-medium truncate">{senderInfo?.username}</div>

							<div className="text-gray-500 text-sm">is calling you...</div>
						</div>
					</div>
				),
				duration: 30,
				showProgress: true,
				pauseOnHover: false,
				placement: "topRight",
				actions: [
					<div className="flex justify-end gap-3">
						<IconControlButton
							activeIcon={PhoneOff}
							inActiveIcon={PhoneOff}
							style={{
								backgroundColor: "#ff4d4f",
							}}
							onClick={rejectIncomingCall}
						/>

						<IconControlButton
							activeIcon={Video}
							inActiveIcon={Video}
							style={{
								backgroundColor: "#16a34a",
							}}
							onClick={acceptIncomingCall}
						/>
					</div>,
				],
				onClose: stopRingtone,
			});
		} else if (callStatus === "rejected" || callStatus === "canceled") {
			removeNotification("outgoing-call", false);
			removeNotification("incoming-call", true);
		} else if (callStatus === "connected") {
			removeNotification("outgoing-call");
			removeNotification("incoming-call");
		} else if (callStatus === "faild") {
			removeNotification("incoming-call");
			removeNotification("outgoing-call");
		}
	}, [callStatus]);

	useEffect(() => {
		if (callStatus !== "connected") return;

		const intervalId = setInterval(() => {
			setCallDuration((prevDuration) => prevDuration + 1);
		}, 1000);

		return () => {
			setCallDuration(0);
			clearInterval(intervalId);
		};
	}, [callStatus]);

	// Cleanup
	useEffect(() => {
		return () => {
			peerConnectionRef.current?.close();
			peerConnectionRef.current = null;
		};
	}, []);

	return (
		<div>
			{/* Meeting info */}
			{/* <MeetingInfo meetingId="AK454679S0DS" sessionLength="00:12:45" /> */}

			{/* The arrangement is local-only swapping it never changes the media connection */}
			<VideoStage
				remoteVideoRef={remoteVideoRef}
				localVideoRef={localVideoRef}
				localAudioRef={localAudioRef}
				remoteName={formatUserName(friendInfo?.name)}
				localName={`${formatUserName(currentUser?.name)} (You)`}
				isLocalPinned={isLocalPinned}
				onSwap={() => setIsLocalPinned((isPinned) => !isPinned)}
			/>

			{/* <audio src={canceledCallRingtone} controls /> */}

			{/* Call Action Buttons */}
			<CallControls
				callStatus={callStatus}
				callDuration={callDuration}
				isAudioOn={isAudioSharing}
				isVideoOn={isLocalVideoSharing}
				isScreenSharing={isScreenSharing}
				onToggleMic={toggleAudioSharing}
				onToggleCamera={toggleVideoSharing}
				onToggleScreen={toggleScreenSharing}
				onStartCall={startCall}
				onEndCall={endCall}
			/>

			{notifyUi}
		</div>
	);
};

export default VideoCall;
