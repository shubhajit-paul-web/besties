import { lazy, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import MainContent from "./MainContent";
import RightSidebar from "./Sidebar/Right/Sidebar";
import LeftSidebar from "./Sidebar/Left/Sidebar";
import socket from "@/lib/socket";
import type { OfferPayload } from "@/features/videoCall/types/videoCall.types";
import { Avatar, notification } from "antd";
import IconControlButton from "../ui/Button/IconControlButton";
import { PhoneOff } from "lucide-react";
const BottomNavigation = lazy(() => import("./Sidebar/mobile/BottomNavigation"));

const AppLayout = () => {
	const { pathname } = useLocation();
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
	const [notify, notifyUi] = notification.useNotification();

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
			webRtcConnection();

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

	const onOfferListener = async (payload: OfferPayload) => {
		try {
			offerPayloadRef.current = payload;
			setSenderInfo(payload.from);
			updateCallStatus("incoming");

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
		} catch (err: unknown) {
			console.error(err);
		}
	};

	useEffect(() => {
		socket.on("offer", onOfferListener);

		return () => {
			socket.off("offer", onOfferListener);
		};
	}, []);

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
