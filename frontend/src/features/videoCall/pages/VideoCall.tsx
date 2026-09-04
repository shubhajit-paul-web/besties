import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, MonitorOff, MonitorUp, Phone, PhoneOff, Video, VideoOff, Volume2, VolumeOff } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import VideoParticipant from "../components/VideoParticipant";
import formatUserName from "@/utils/formatUserName";
import IconControlButton from "@/components/ui/Button/IconControlButton";
import { toast } from "react-toastify";
import socket from "@/lib/socket";
import { useParams } from "react-router-dom";
import { Avatar, notification } from "antd";
import type { CallStatus, OfferPayload } from "../types/videoCall.types";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";

const isMediaStreamEmpty = (stream: MediaStream) => {
	return stream.getVideoTracks().length === 0 && stream.getAudioTracks().length === 0;
};

const VideoCall = () => {
	const { user: currentUser } = useCurrentUser();
	const { friendId } = useParams();
	const [notify, notifyUi] = notification.useNotification();

	const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
	const localVideoRef = useRef<HTMLVideoElement | null>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const localAudioRef = useRef<HTMLAudioElement | null>(null);
	const peerConnection = useRef<RTCPeerConnection | null>(null);

	const [isLocalVideoSharing, setIsLocalVideoSharing] = useState(false);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isAudioSharing, setIsAudioSharing] = useState(false);
	const [callStatus, setCallStatus] = useState<CallStatus>("pending");
	const [senderInfo, setSenderInfo] = useState<OfferPayload["from"] | null>(null);
	// const [receiverInfo, setReceiverInfo] = useState<OfferPayload["from"] | null>(null);

	const { data: friendProfileRes } = useSWR(friendId ? `/users/${friendId}` : null, fetcher);

	const friendInfo = friendProfileRes?.data ?? {};

	const toggleVideoSharing = async () => {
		const localVideoElement = localVideoRef.current;
		if (!localVideoElement) return;

		if (!navigator.mediaDevices?.getUserMedia) {
			return toast.error("Camera access isn’t supported by your browser.");
		}

		try {
			if (!isLocalVideoSharing) {
				let localStream = localStreamRef.current;

				if (!localStream) {
					localStream = new MediaStream();
					localStreamRef.current = localStream;
				}

				const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });

				const videoTrack = cameraStream.getVideoTracks()[0];
				if (!videoTrack) return;

				localStream.addTrack(videoTrack);

				localVideoElement.srcObject = localStream;
				setIsLocalVideoSharing(true);
			} else {
				const localStream = localStreamRef.current;
				if (!localStream) return;

				const videoTrack = localStream.getVideoTracks()[0];

				if (videoTrack) {
					videoTrack.stop();
					localStream.removeTrack(videoTrack);
				}

				localVideoElement.srcObject = null;

				if (isMediaStreamEmpty(localStream)) {
					localStreamRef.current = null;
				}

				setIsLocalVideoSharing(false);
			}
		} catch (err) {
			console.error("Failed to access camera:", err);

			let errorMessage = "Unable to access your camera. Please try again.";

			if (err instanceof DOMException) {
				switch (err.name) {
					case "NotAllowedError":
						errorMessage = "Camera access was denied. Please allow access in your browser settings.";
						break;

					case "NotFoundError":
						errorMessage = "No camera was found on your device.";
						break;

					case "NotReadableError":
						errorMessage = "Your camera couldn't be accessed. It may be in use by another application.";
						break;
				}
			}

			toast.error(errorMessage);
		}
	};

	const toggleScreenSharing = async () => {
		const videoElement = localVideoRef.current;
		if (!videoElement) return;

		if (!navigator.mediaDevices?.getDisplayMedia) {
			return toast.error("Screen sharing isn't supported by your browser.");
		}

		try {
			if (!isScreenSharing) {
				let localStream = localStreamRef.current;

				if (!localStream) {
					localStream = new MediaStream();
					localStreamRef.current = localStream;
				}

				const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });

				const screenTrack = screenStream.getVideoTracks()[0];
				if (!screenTrack) return;

				const cameraTrack = localStream.getVideoTracks()[0];

				/* Camera and screen sharing both use a video track. We replace the camera track so the local stream only has one video source. */
				if (cameraTrack) {
					cameraTrack.stop();
					localStream.removeTrack(cameraTrack);
					setIsLocalVideoSharing(false);
				}

				/* The browser can stop screen sharing without going through this toggle (for example, when the user clicks "Stop sharing" in the browser UI). Keep our React state in sync with that. */
				screenTrack.addEventListener("ended", () => {
					videoElement.srcObject = null;
					localStream.removeTrack(screenTrack);

					if (isMediaStreamEmpty(localStream)) {
						localStreamRef.current = null;
					}

					setIsScreenSharing(false);
				});

				localStream.addTrack(screenTrack);

				videoElement.srcObject = localStream;

				setIsScreenSharing(true);
			} else {
				const localStream = localStreamRef.current;
				if (!localStream) return;

				const screenTrack = localStream.getVideoTracks()[0];

				if (screenTrack) {
					screenTrack.stop();
					localStream.removeTrack(screenTrack);
				}

				if (localStream.getVideoTracks().length === 0) {
					videoElement.srcObject = null;
				}
				if (isMediaStreamEmpty(localStream)) {
					localStreamRef.current = null;
				}

				setIsScreenSharing(false);
			}
		} catch (err) {
			console.error("Failed to access screen sharing:", err);

			let errorMessage = "Unable to share your screen. Please try again.";

			if (err instanceof DOMException) {
				switch (err.name) {
					case "NotAllowedError":
						errorMessage = "Screen sharing was cancelled or denied. Please allow screen sharing to continue.";
						break;

					case "NotFoundError":
						errorMessage = "No screen or window was available to share.";
						break;

					case "NotReadableError":
						errorMessage = "Your screen couldn't be shared. Please try again.";
						break;

					case "AbortError":
						errorMessage = "Screen sharing was cancelled. Please try again.";
						break;
				}
			}

			toast.error(errorMessage);
		}
	};

	const toggleAudioSharing = async () => {
		if (!navigator.mediaDevices?.getUserMedia) {
			return toast.error("Microphone access isn’t supported by your browser.");
		}

		try {
			if (!isAudioSharing) {
				let stream = localStreamRef.current;

				if (!stream) {
					stream = new MediaStream();
					localStreamRef.current = stream;
				}

				const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });

				const audioTrack = microphoneStream.getAudioTracks()[0];
				if (!audioTrack) return;

				stream.addTrack(audioTrack);

				if (localAudioRef.current) {
					localAudioRef.current.srcObject = microphoneStream;
				}

				setIsAudioSharing(true);
			} else {
				const localStream = localStreamRef.current;
				if (!localStream) return;

				const audioTrack = localStream.getAudioTracks()[0];

				if (audioTrack) {
					audioTrack.stop();
					localStream.removeTrack(audioTrack);
				}

				if (isMediaStreamEmpty(localStream)) {
					localStreamRef.current = null;
				}

				setIsAudioSharing(false);
			}
		} catch (err) {
			console.error("Failed to access microphone:", err);

			toast.error("Unable to access your microphone. Please try again.");
		}
	};

	const webRtcConnection = () => {
		const pc = (peerConnection.current = new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
				},
			],
		}));

		pc.onicecandidate = (event) => {
			console.log("New candidate:", event.candidate);
		};

		pc.onconnectionstatechange = () => {
			console.log("Connection state:", pc.connectionState);
		};

		pc.ontrack = (event) => {
			console.log("Streams:", event.streams);
		};

		const localStream = localStreamRef.current;

		if (localStream) {
			localStream.getTracks().forEach((track) => {
				pc.addTrack(track, localStream);
			});
		}

		peerConnection.current = pc;
	};

	const startCall = async () => {
		if (!isLocalVideoSharing && !isScreenSharing && !isAudioSharing) {
			await toggleVideoSharing();
			// return showErrorToast("Turn on your camera or microphone to start the call.");
		}

		webRtcConnection();

		const pc = peerConnection.current;
		if (!pc) return;

		const offer = await pc.createOffer();
		await pc.setLocalDescription(offer);

		setCallStatus("calling");

		socket.emit("offer", {
			to: friendId,
			offer: pc.localDescription,
		});
	};

	const onOffer = (payload: OfferPayload) => {
		setCallStatus("incoming");
		setSenderInfo(payload.from);

		console.log("on offer:", payload);
	};

	useEffect(() => {
		socket.on("offer", onOffer);

		return () => {
			socket.off("offer", onOffer);
		};
	}, []);

	useEffect(() => {
		if (callStatus === "pending") return;

		if (callStatus === "incoming") {
			return notify.open({
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
							// onClick={handleRejectCall}
						/>

						<IconControlButton
							activeIcon={Video}
							inActiveIcon={Video}
							style={{
								backgroundColor: "#16a34a",
							}}
							// onClick={handleAcceptCall}
						/>
					</div>,
				],
			});
		}

		if (callStatus === "calling") {
			return notify.open({
				// title: "Calling...",

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

				actions: (
					<div className="flex justify-end">
						<IconControlButton
							activeIcon={PhoneOff}
							inActiveIcon={PhoneOff}
							// onClick={handleCancelCall}
						/>
					</div>
				),
			});
		}
	}, [callStatus]);

	return (
		<div>
			{/* Meeting info */}
			{/* <MeetingInfo meetingId="AK454679S0DS" sessionLength="00:12:45" /> */}

			{/* Video */}
			<div className="w-full">
				{/* Remote video */}
				<VideoParticipant fullName="Harsh Dey">
					<video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover absolute top-0 left-0" />
				</VideoParticipant>

				{/* Local video and audio */}
				<VideoParticipant fullName={formatUserName(currentUser?.name)} style={{ width: "50%" }}>
					<video ref={localVideoRef} autoPlay playsInline className="w-full h-full object-cover absolute top-0 left-0" />

					<audio ref={localAudioRef} autoPlay playsInline />
				</VideoParticipant>
			</div>

			{/* Call Action Buttons */}
			<div className="flex justify-center items-center gap-5 bg-slate-100/70 rounded-3xl p-5 border border-slate-200 w-fit m-auto">
				<IconControlButton activeIcon={Mic} inActiveIcon={MicOff} isActive={isAudioSharing} tooltipTitle="Microphone" onClick={toggleAudioSharing} />
				<IconControlButton activeIcon={Video} inActiveIcon={VideoOff} isActive={isLocalVideoSharing} tooltipTitle="Camera" onClick={toggleVideoSharing} />
				<IconControlButton activeIcon={MonitorUp} inActiveIcon={MonitorOff} isActive={isScreenSharing} tooltipTitle="Screen" onClick={toggleScreenSharing} />
				<IconControlButton activeIcon={Volume2} inActiveIcon={VolumeOff} isActive={true} tooltipTitle="Voice" />

				<div className="flex gap-5">
					{/* Accept */}
					<button
						onClick={startCall}
						type="button"
						className="flex px-6 py-3 items-center justify-center gap-2.5 font-medium rounded-full bg-green-600 text-white transition-colors hover:bg-green-700 active:bg-green-800 cursor-pointer">
						<Phone size={20} />
						Call
					</button>

					{/* End */}
					<button
						type="button"
						className="flex px-6 py-3 items-center justify-center gap-2.5 font-medium rounded-full bg-red-500 text-white transition-colors hover:bg-red-600 active:bg-red-700 cursor-pointer">
						<PhoneOff size={20} />
						End
					</button>
				</div>
			</div>

			{notifyUi}
		</div>
	);
};

export default VideoCall;
