/* eslint-disable react-hooks/exhaustive-deps */
import { lazy, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import MainContent from "./MainContent";
import RightSidebar from "./Sidebar/Right/Sidebar";
import LeftSidebar from "./Sidebar/Left/Sidebar";
import useAppContext from "@/hooks/useAppContext";
import useIncomingCall from "@/features/videoCall/hooks/useIncomingCall";
import { Avatar, notification } from "antd";
import IconControlButton from "../ui/Button/IconControlButton";
import { PhoneOff, Video } from "lucide-react";
import formatUserName from "@/utils/formatUserName";
const BottomNavigation = lazy(() => import("./Sidebar/mobile/BottomNavigation"));

const AppLayout = () => {
	const { pathname } = useLocation();
	const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
	const { videoCallCommunication } = useAppContext();
	const { incomingCall, acceptIncomingCall, rejectIncomingCall, stopIncomingCallRingtone } = useIncomingCall();
	const [notify, notifyUi] = notification.useNotification();
	const { videoCallStatus } = videoCallCommunication;

	// Pause ringing audio and destroy the notification UI
	const removeNotification = (notificationKey: string, shouldStopRingtone: boolean = true) => {
		if (shouldStopRingtone) {
			stopIncomingCallRingtone();
		}

		notify.destroy(notificationKey);
	};

	useEffect(() => {
		if (!incomingCall) {
			notify.destroy("incoming-call");
			return;
		}

		const sender = incomingCall.from;
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
				<div className="flex justify-end gap-3" key="incoming-call-actions">
					<IconControlButton activeIcon={PhoneOff} inActiveIcon={PhoneOff} style={{ backgroundColor: "#ff4d4f" }} onClick={rejectIncomingCall} />

					<IconControlButton activeIcon={Video} inActiveIcon={Video} style={{ backgroundColor: "#16a34a" }} onClick={acceptIncomingCall} />
				</div>,
			],
			onClose: stopIncomingCallRingtone,
		});
	}, [acceptIncomingCall, incomingCall, notify, rejectIncomingCall, stopIncomingCallRingtone]);

	useEffect(() => {
		if (videoCallStatus === "pending") return;

		if (videoCallStatus === "rejected" || videoCallStatus === "canceled") {
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

			{/* ant design notification ui */}
			{notifyUi}
		</div>
	);
};

export default AppLayout;
