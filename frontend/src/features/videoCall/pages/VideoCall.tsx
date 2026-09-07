/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { Clock, Mic, MicOff, MonitorOff, MonitorUp, Phone, PhoneOff, Video, VideoOff, Volume2, VolumeOff } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import VideoStage from "../components/VideoStage";
import formatUserName from "@/utils/formatUserName";
import IconControlButton from "@/components/ui/Button/IconControlButton";
import { toast } from "react-toastify";
import socket from "@/lib/socket";
import { useParams } from "react-router-dom";
import { Avatar, notification } from "antd";
import type { AnswerPayload, CallStatus, ICECandidatePayload, OfferPayload } from "../types/videoCall.types";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import formatCallDuration from "@/utils/formatCallDuration";
import { showErrorToast } from "../utils/toast";

// Ringing audio for incoming and outgoing call
import outgoingCallRingtone from "@/assets/audio/phone-ringing.mp3";
import incomingCallRingtone from "@/assets/audio/incoming-call-ringtone.mp3";
import canceledCallRingtone from "@/assets/audio/call-reject-ringtone.wav";

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
	const offerPayloadRef = useRef<OfferPayload | null>(null);
	const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
	const pendingIceCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
	const ringingAudio = useRef<HTMLAudioElement | null>(null);
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

	// Stop call ringtone
	const stopRingtone = () => {
		const player = ringingAudio.current;
		if (!player) return;

		player.pause();
		player.currentTime = 0;
	};

	// Play call ringtone
	const playRingtone = async (type: "calling" | "incoming" | "canceled", loop: boolean = true) => {
		if (!ringingAudio.current) {
			ringingAudio.current = new Audio();
		}

		stopRingtone();

		const ringtones = {
			calling: outgoingCallRingtone,
			incoming: incomingCallRingtone,
			canceled: canceledCallRingtone,
		};

		const player = ringingAudio.current;

		player.src = ringtones[type];
		player.loop = loop;
		player.load();

		try {
			await player.play();
		} catch (error) {
			console.error("Failed to play ringtone:", error);
		}
	};

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

	// Media controls
	const toggleVideoSharing = async () => {
		const localVideoElement = localVideoRef.current;
		if (!localVideoElement) return;

		if (!navigator.mediaDevices?.getUserMedia) {
			toast.error("Camera access isn’t supported by your browser.");
			return;
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

			return true;
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

			return false;
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
					// setIsLocalVideoSharing(false);
					// localStream.removeTrack(cameraTrack);
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

	// WebRTC connection initiator
	const webRtcConnection = () => {
		const pc = new RTCPeerConnection({
			iceServers: [
				{
					urls: "stun:stun.l.google.com:19302",
				},
			],
		});

		pc.onicecandidate = (event) => {
			if (event.candidate) {
				socket.emit("ice-candidate", {
					to: friendId,
					candidate: event.candidate,
				});
			}
		};

		pc.onconnectionstatechange = () => {
			const connectionState = pc.connectionState;

			if (connectionState === "connected") {
				updateCallStatus("connected");
			} else if (connectionState === "closed" || connectionState === "disconnected") {
				updateCallStatus("ended");
			}
		};

		pc.ontrack = (event) => {
			console.log("On track fired");

			const remoteVideoElement = remoteVideoRef.current;
			if (!remoteVideoElement) return;

			const remoteStream = event.streams[0];

			remoteVideoElement.srcObject = remoteStream;
		};

		const localStream = localStreamRef.current;

		if (localStream) {
			localStream.getTracks().forEach((track) => {
				pc.addTrack(track, localStream);
			});
		}

		peerConnectionRef.current = pc;
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
			webRtcConnection();

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
			<div className="relative z-30 mx-auto mt-6 flex w-fit max-w-full flex-wrap items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-slate-100/70 p-4 sm:gap-5 sm:p-5">
				<IconControlButton activeIcon={Mic} inActiveIcon={MicOff} isActive={isAudioSharing} tooltipTitle="Microphone" onClick={toggleAudioSharing} />
				<IconControlButton activeIcon={Video} inActiveIcon={VideoOff} isActive={isLocalVideoSharing} tooltipTitle="Camera" onClick={toggleVideoSharing} />
				<IconControlButton activeIcon={MonitorUp} inActiveIcon={MonitorOff} isActive={isScreenSharing} tooltipTitle="Screen" onClick={toggleScreenSharing} />
				<IconControlButton activeIcon={Volume2} inActiveIcon={VolumeOff} isActive={true} tooltipTitle="Voice" />

				<div className="flex gap-5">
					{/* show call duration timer */}
					{callStatus === "connected" && (
						<div className="bg-white border border-zinc-200 text-zinc-600 flex justify-center items-center gap-1.5 my-auto px-3 py-1 rounded-full">
							<Clock size={16} />
							<label>{formatCallDuration(callDuration)}</label>
						</div>
					)}

					{/* Call button */}
					{callStatus !== "connected" && (
						<button
							onClick={startCall}
							type="button"
							className="flex px-6 py-3 items-center justify-center gap-2.5 font-medium rounded-full bg-green-600 text-white transition-colors hover:bg-green-700 active:bg-green-800 cursor-pointer"
							disabled={callStatus === "calling"}>
							<Phone size={20} />
							{callStatus === "calling" ? "Calling..." : "Call"}
						</button>
					)}

					{/* End button */}
					{callStatus === "connected" && (
						<button
							onClick={endCall}
							type="button"
							className="flex px-6 py-3 items-center justify-center gap-2.5 font-medium rounded-full bg-red-500 text-white transition-colors hover:bg-red-600 active:bg-red-700 cursor-pointer">
							<PhoneOff size={20} />
							End
						</button>
					)}
				</div>
			</div>

			{notifyUi}
		</div>
	);
};

export default VideoCall;
