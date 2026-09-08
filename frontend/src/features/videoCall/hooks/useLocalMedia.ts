import useAppContext from "@/hooks/useAppContext";
import { toast } from "react-toastify";

// type UseLocalMediaProps = {
// 	localVideoRef: RefObject<HTMLVideoElement | null>;
// 	localAudioRef: RefObject<HTMLAudioElement | null>;
// 	isCameraOn: boolean;
// 	setIsCameraOn: Dispatch<SetStateAction<boolean>>;
// 	isMicOn: boolean;
// 	setIsMicOn: Dispatch<SetStateAction<boolean>>;
// 	isScreenSharing: boolean;
// 	setIsScreenSharing: Dispatch<SetStateAction<boolean>>;
// };

const isMediaStreamEmpty = (stream: MediaStream) => {
	return stream.getVideoTracks().length === 0 && stream.getAudioTracks().length === 0;
};

const useLocalMedia = () => {
	const { videoCallCommunication } = useAppContext();
	const {
		videoCallLocalVideoRef: localVideoRef,
		videoCallLocalAudioRef: localAudioRef,
		isVideoCallCameraOn: isCameraOn,
		setIsVideoCallCameraOn: setIsCameraOn,
		isVideoCallMicOn: isMicOn,
		setIsVideoCallMicOn: setIsMicOn,
		isVideoCallScreenSharing: isScreenSharing,
		setIsVideoCallScreenSharing: setIsScreenSharing,
		videoCallLocalStreamRef: localStreamRef,
	} = videoCallCommunication;

	const getOrCreateStream = () => {
		if (!localStreamRef.current) {
			localStreamRef.current = new MediaStream();
		}
		return localStreamRef.current;
	};

	const toggleVideoSharing = async () => {
		const localVideoElement = localVideoRef.current;

		if (!localVideoElement) return;

		if (!navigator.mediaDevices?.getUserMedia) {
			toast.error("Camera access isn’t supported by your browser.");
			return;
		}

		try {
			if (!isCameraOn) {
				const localStream = getOrCreateStream();
				const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });

				const videoTrack = cameraStream.getVideoTracks()[0];
				if (!videoTrack) return;

				localStream.addTrack(videoTrack);

				localVideoElement.srcObject = localStream;
				setIsCameraOn(true);
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

				setIsCameraOn(false);
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
				const localStream = getOrCreateStream();
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
			if (!isMicOn) {
				const localStream = getOrCreateStream();
				const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });

				const audioTrack = microphoneStream.getAudioTracks()[0];
				if (!audioTrack) return;

				localStream.addTrack(audioTrack);

				if (localAudioRef.current) {
					localAudioRef.current.srcObject = microphoneStream;
				}

				setIsMicOn(true);
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

				setIsMicOn(false);
			}
		} catch (err) {
			console.error("Failed to access microphone:", err);

			toast.error("Unable to access your microphone. Please try again.");
		}
	};

	return {
		toggleVideoSharing,
		toggleScreenSharing,
		toggleAudioSharing,
		localMediaStates: {
			isCameraOn,
			isMicOn,
			isScreenSharing,
		},
	};
};

export default useLocalMedia;
