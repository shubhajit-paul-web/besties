/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import MainContent from "./MainContent";
import RightSidebar from "./Sidebar/Right/Sidebar";
import LeftSidebar from "./Sidebar/Left/Sidebar";
import socket from "@/lib/socket";
import type { OfferPayload } from "@/features/videoCall/types/videoCall.types";
import useAppContext from "@/hooks/useAppContext";
import useRingtone from "@/features/videoCall/hooks/useRingtone";
import useWebRTC from "@/hooks/useWebRTC";
import { showErrorToast } from "@/features/videoCall/utils/toast";
import useLocalMedia from "@/features/videoCall/hooks/useLocalMedia";
import { Avatar, notification } from "antd";
import IconControlButton from "../ui/Button/IconControlButton";
import { PhoneOff, Video } from "lucide-react";
import formatUserName from "@/utils/formatUserName";
import { toast } from "react-toastify";
const BottomNavigation = lazy(() => import("./Sidebar/mobile/BottomNavigation"));

const AppLayout = () => {
	const { pathname } = useLocation();
	const navigate = useNavigate();
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
	const [notify, notifyUi] = notification.useNotification();
	const { videoCallCommunication } = useAppContext();

	const { initiateWebRtcConnection, cleanupVideoCall } = useWebRTC();
	const { toggleVideoSharing } = useLocalMedia();
	const { playRingtone, stopRingtone } = useRingtone();

	const {
		isVideoCallCameraOn: isCameraOn,
		isVideoCallMicOn: isMicOn,
		isVideoCallScreenSharing: isScreenSharing,
		videoCallOfferPayloadRef: offerPayloadRef,
		setVideoCallSenderInfo: setSenderInfo,
		videoCallStatusRef: callStatusRef,
		videoCallStatus,
		videoCallLocalStreamRef,
		videoCallPendingIceCandidatesRef: pendingIceCandidatesRef,
		videoCallPeerConnectionRef,
		updateVideoCallStatus,
	} = videoCallCommunication;

	// Pause ringing audio and destroy the notification UI
	const removeNotification = (notificationKey: string, shouldStopRingtone: boolean = true) => {
		if (shouldStopRingtone) {
			stopRingtone();
		}

		notify.destroy(notificationKey);
	};

	const rejectIncomingCall = () => {
		if (callStatusRef.current !== "incoming") return;

		socket.emit("cancel-call", {
			to: offerPayloadRef.current?.from._id,
		});

		updateVideoCallStatus("rejected");

		offerPayloadRef.current = null;
	};

	const acceptIncomingCall = async () => {
		removeNotification("incoming-call");

		const offerPayload = offerPayloadRef.current;
		if (!offerPayload) return;

		const sender = offerPayload.from;

		navigate(`/app/video-call/${sender._id}`, {
			state: {
				incomingCall: true,
				offerPayload,
			},
		});

		if (!isCameraOn && !isScreenSharing && !isMicOn) {
			const mediaStarted = await toggleVideoSharing();

			if (!mediaStarted) {
				updateVideoCallStatus("failed");
				return;
			}
		}

		if (!videoCallLocalStreamRef.current) return;

		try {
			// navigate("")

			initiateWebRtcConnection(sender._id);

			const pc = videoCallPeerConnectionRef.current;

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

			// clean up the partially created WebRTC connection
			videoCallPeerConnectionRef.current?.close();
			videoCallPeerConnectionRef.current = null;

			updateVideoCallStatus("failed");
			showErrorToast("Unable to connect the call. Please try again.");
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
				updateVideoCallStatus("rejected");
			}, 1000);

			// Clean up the call and reset all related resources
			cleanupVideoCall();
		} else if (callStatusRef.current === "incoming") {
			updateVideoCallStatus("rejected");
		}
	};

	const onOfferListener = async (payload: OfferPayload) => {
		const sender = payload.from;

		try {
			offerPayloadRef.current = payload;

			setSenderInfo(sender);
			updateVideoCallStatus("incoming");
			playRingtone("incoming");

			notify.open({
				key: "incoming-call",
				title: "Incoming video call",
				description: (
					<div className="flex items-center gap-3 mt-1">
						<Avatar size={44} src={sender?.avatar ?? "/profile-img.jpeg"} />

						<div className="min-w-0">
							<div className="font-medium truncate capitalize">{formatUserName(sender?.name)}</div>

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
		} catch (err: unknown) {
			console.error(err);
		}
	};

	// Socket.io listeners
	useEffect(() => {
		socket.on("offer", onOfferListener);
		socket.on("cancel-call", onCancelCallListener);

		return () => {
			socket.off("offer", onOfferListener);
			socket.off("cancel-call", onCancelCallListener);
		};
	}, []);

	useEffect(() => {
		if (videoCallStatus === "pending") return;

		if (videoCallStatus === "rejected" || videoCallStatus === "canceled") {
			removeNotification("outgoing-call", false);
			removeNotification("incoming-call", true);
		}
	}, [videoCallStatus]);

	if (pathname === "/app" || pathname === "/app/") {
		return <Navigate to="/app/home" />;
	}

	const LEFT_SIDEBAR_WIDTH = 320;
	const RIGHT_SIDEBAR_WIDTH = 470;
	const LEFT_SIDEBAR_OPEN_WIDTH = 160;

	return (
		<div className="min-h-screen">
			{/* Left Sidebar - Menu */}
			<LeftSidebar isLeftSidebarOpen={isLeftSidebarOpen} leftSidebarWidth={LEFT_SIDEBAR_WIDTH} leftSidebarOpenWidth={LEFT_SIDEBAR_OPEN_WIDTH} />

			{/* Main Content */}
			<MainContent
				isLeftSidebarOpen={isLeftSidebarOpen}
				setIsLeftSidebarOpen={(state) => setIsLeftSidebarOpen(state)}
				leftSidebarWidth={LEFT_SIDEBAR_WIDTH}
				leftSidebarOpenWidth={LEFT_SIDEBAR_OPEN_WIDTH}
				rightSidebarWidth={RIGHT_SIDEBAR_WIDTH}
			/>

			{/* Right Sidebar - My friends */}
			<RightSidebar rightSidebarWidth={RIGHT_SIDEBAR_WIDTH} />

			{/* Bottom Navigation for Mobile */}
			<BottomNavigation />

			{notifyUi}
		</div>
	);
};

export default AppLayout;
