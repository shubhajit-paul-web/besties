/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";
import { PhoneOff } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import useAppContext from "@/hooks/useAppContext";
import VideoStage from "../components/VideoStage";
import formatUserName from "@/utils/formatUserName";
import IconControlButton from "@/components/ui/Button/IconControlButton";
import socket from "@/lib/socket";
import { useLocation, useParams } from "react-router-dom";
import { Avatar, notification } from "antd";
import type { AnswerPayload, ICECandidatePayload } from "../types/videoCall.types";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { showErrorToast } from "../utils/toast";
import useWebRTC from "@/hooks/useWebRTC";
import useLocalMedia from "../hooks/useLocalMedia";
import useRingtone from "../hooks/useRingtone";
import CallControls from "../components/CallControls";

const VideoCall = () => {
	const { friendId } = useParams();
	const location = useLocation();
	const hasAcceptedCallRef = useRef(false);
	const [isLocalPinned, setIsLocalPinned] = useState(false);
	const { user: currentUser } = useCurrentUser();
	const { videoCallCommunication } = useAppContext();
	const [notify, notifyUi] = notification.useNotification();
	const { data: friendProfileRes } = useSWR(friendId ? `/users/${friendId}` : null, fetcher);

	const friendInfo = friendProfileRes?.data ?? {};
	const { incomingCall, offerPayload } = location.state ?? {};
	const {
		isVideoCallCameraOn: isCameraOn,
		isVideoCallMicOn: isMicOn,
		isVideoCallScreenSharing: isScreenSharing,
		videoCallStatus: callStatus,
		videoCallDuration: callDuration,
		setVideoCallDuration: setCallDuration,
		videoCallPeerConnectionRef: peerConnectionRef,
		videoCallPendingIceCandidatesRef: pendingIceCandidatesRef,
		videoCallLocalStreamRef: localStreamRef,
		videoCallStatusRef: callStatusRef,
		updateVideoCallStatus: updateCallStatus,
		videoCallOfferPayloadRef: offerPayloadRef,
	} = videoCallCommunication;

	const { initiateWebRtcConnection, cleanupVideoCall } = useWebRTC();
	const { toggleVideoSharing, toggleScreenSharing, toggleAudioSharing } = useLocalMedia();
	const { playRingtone, stopRingtone } = useRingtone();

	// Pause ringing audio and destroy the notification UI
	const removeNotification = (notificationKey: string, shouldStopRingtone: boolean = true) => {
		if (shouldStopRingtone) {
			stopRingtone();
		}

		notify.destroy(notificationKey);
	};

	const cancelOutgoingCall = () => {
		if (callStatusRef.current !== "calling") return;

		socket.emit("cancel-call", {
			to: friendId,
		});

		updateCallStatus("canceled");

		// Clean up the call and reset all related resources
		cleanupVideoCall();
	};

	const startCall = async () => {
		// Make sure at least one media type is available.
		if (!isCameraOn && !isScreenSharing && !isMicOn) {
			const mediaStarted = await toggleVideoSharing();

			if (!mediaStarted) {
				updateCallStatus("failed");
				return;
			}
		}

		try {
			initiateWebRtcConnection(friendId);

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

			updateCallStatus("failed");

			showErrorToast("Unable to start the call. Please try again.");
		}
	};

	const endCall = () => {
		const activeCallStatuses = ["incoming", "calling", "connected"];
		if (!activeCallStatuses.includes(callStatusRef.current)) return;

		socket.emit("end-call", {
			to: friendId,
		});

		updateCallStatus("ended");
		cleanupVideoCall();
	};

	// Socket.io handlers
	const onAnswerListener = useCallback(async (payload: AnswerPayload) => {
		console.log({ answer: payload.answer });

		const pc = peerConnectionRef.current;
		if (!pc) return;

		try {
			await pc.setRemoteDescription(payload.answer);
		} catch (err: unknown) {
			console.error(err);
		}
	}, []);

	const onIceCandidateListener = useCallback(async (payload: ICECandidatePayload) => {
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
	}, []);

	const onEndCallListener = useCallback(({ from }: { from: string }) => {
		if (from === friendId) {
			console.log("call ended from remote", { from, friendId });

			cleanupVideoCall();
			updateCallStatus("ended");
		}
	}, []);

	// Socket.io listeners
	useEffect(() => {
		socket.on("answer", onAnswerListener);
		socket.on("ice-candidate", onIceCandidateListener);
		socket.on("end-call", onEndCallListener);

		return () => {
			socket.off("answer", onAnswerListener);
			socket.off("ice-candidate", onIceCandidateListener);
			socket.off("end-call", onEndCallListener);
		};
	}, []);

	useEffect(() => {
		if (!incomingCall || !offerPayload || hasAcceptedCallRef.current) return;
		hasAcceptedCallRef.current = true;

		const acceptCall = async () => {
			if (!isCameraOn && !isScreenSharing && !isMicOn) {
				const mediaStarted = await toggleVideoSharing();

				if (!mediaStarted) {
					updateCallStatus("failed");
					return;
				}
			}

			if (!localStreamRef.current) {
				updateCallStatus("failed");
				return;
			}

			try {
				initiateWebRtcConnection(offerPayload.from._id);

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
			} catch (err) {
				console.error("Failed to accept incoming call:", err);

				peerConnectionRef.current?.close();
				peerConnectionRef.current = null;

				updateCallStatus("failed");
				showErrorToast("Unable to connect the call. Please try again.");
			}
		};

		acceptCall();
	}, [incomingCall, offerPayload]);

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
							<div className="font-medium truncate capitalize">{formatUserName(friendInfo?.name)}</div>

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
		} else if (callStatus === "rejected" || callStatus === "canceled") {
			removeNotification("outgoing-call", true);
		} else if (callStatus === "connected") {
			removeNotification("outgoing-call");
			removeNotification("incoming-call");
		} else if (callStatus === "failed") {
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
		return cleanupVideoCall;
	}, []);

	return (
		<div>
			{/* Meeting info */}
			{/* <MeetingInfo meetingId="AK454679S0DS" sessionLength="00:12:45" /> */}

			{/* The arrangement is local-only swapping it never changes the media connection */}
			<VideoStage
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
				isAudioOn={isMicOn}
				isVideoOn={isCameraOn}
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
