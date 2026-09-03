import { useRef, useState } from "react";
import { Mic, MicOff, MonitorOff, MonitorUp, Phone, Video, VideoOff, Volume2, VolumeOff } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import MeetingInfo from "../components/MeetingInfo";
import VideoParticipant from "../components/VideoParticipant";
import formatUserName from "@/utils/formatUserName";
import IconControlButton from "@/components/ui/Button/IconControlButton";
import { toast } from "react-toastify";

const isMediaStreamEmpty = (stream: MediaStream) => {
	return stream.getVideoTracks().length === 0 && stream.getAudioTracks().length === 0;
};

const VideoCall = () => {
	const { user: currentUser } = useCurrentUser();

	const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
	const localVideoRef = useRef<HTMLVideoElement | null>(null);
	const localStreamRef = useRef<MediaStream | null>(null);
	const localAudioRef = useRef<HTMLAudioElement | null>(null);

	const [isLocalVideoSharing, setIsLocalVideoSharing] = useState(false);
	const [isScreenSharing, setIsScreenSharing] = useState(false);
	const [isAudioSharing, setIsAudioSharing] = useState(false);

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

	return (
		<div>
			{/* Meeting info */}
			<MeetingInfo meetingId="AK454679S0DS" sessionLength="00:12:45" />

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
				<IconControlButton activeIcon={Mic} inActiveIcon={MicOff} isActive={isAudioSharing} onClick={toggleAudioSharing} />
				<IconControlButton activeIcon={Video} inActiveIcon={VideoOff} isActive={isLocalVideoSharing} onClick={toggleVideoSharing} />
				<IconControlButton activeIcon={MonitorUp} inActiveIcon={MonitorOff} isActive={isScreenSharing} onClick={toggleScreenSharing} />
				<IconControlButton activeIcon={Volume2} inActiveIcon={VolumeOff} isActive={true} />

				<button className="bg-red-500 text-white hover:bg-red-700 active:bg-red-800 transition-colors py-3.5 px-8 rounded-full cursor-pointer">
					<Phone size={25} className="rotate-135" />
				</button>
			</div>
		</div>
	);
};

export default VideoCall;
