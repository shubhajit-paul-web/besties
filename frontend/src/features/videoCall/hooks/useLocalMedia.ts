import useAppContext from "@/hooks/useAppContext";
import { toast } from "react-toastify";

const isMediaStreamEmpty = (stream: MediaStream) => {
	return stream.getVideoTracks().length === 0 && stream.getAudioTracks().length === 0;
};

const useLocalMedia = () => {
	const { videoCallCommunication } = useAppContext();
	const {
		videoCallLocalVideoRef: localVideoRef,
		isVideoCallCameraOn: isCameraOn,
		setIsVideoCallCameraOn: setIsCameraOn,
		isVideoCallMicOn: isMicOn,
		setIsVideoCallMicOn: setIsMicOn,
		isVideoCallScreenSharing: isScreenSharing,
		setIsVideoCallScreenSharing: setIsScreenSharing,
		videoCallLocalStreamRef: localStreamRef,
		videoCallPeerConnectionRef: peerConnectionRef,
	} = videoCallCommunication;

	const getOrCreateStream = () => {
		if (!localStreamRef.current) {
			localStreamRef.current = new MediaStream();
		}
		return localStreamRef.current;
	};

	const getSenderForKind = (kind: "audio" | "video") => {
		const pc = peerConnectionRef.current;
		if (!pc) return;

		return pc.getTransceivers().find((t) => t.receiver.track.kind === kind)?.sender;
	};

	const attachTrack = async (track: MediaStreamTrack, localStream: MediaStream) => {
		const pc = peerConnectionRef.current;
		const sender = getSenderForKind(track.kind as "audio" | "video");

		if (sender) {
			await sender.replaceTrack(track);
		} else if (pc) {
			pc.addTrack(track, localStream);
		}
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
				const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: !isMicOn });
				const cameraTrack = cameraStream.getVideoTracks()[0];
				const audioTrack = cameraStream.getAudioTracks()[0];

				if (!cameraTrack) return false;

				const screenTrack = localStream.getVideoTracks()[0];

				if (screenTrack && isScreenSharing) {
					screenTrack.stop();
					localStream.removeTrack(screenTrack);
					setIsScreenSharing(false);
				}

				localStream.addTrack(cameraTrack);
				if (audioTrack) localStream.addTrack(audioTrack);

				await attachTrack(cameraTrack, localStream);
				if (audioTrack) await attachTrack(audioTrack, localStream);

				localVideoElement.srcObject = localStream;
				setIsCameraOn(true);
				if (audioTrack) setIsMicOn(true);
			} else {
				const localStream = localStreamRef.current;
				if (!localStream) return;

				const videoTrack = localStream.getVideoTracks()[0];

				if (videoTrack) {
					videoTrack.stop();
					localStream.removeTrack(videoTrack);
					await getSenderForKind("video")?.replaceTrack(null);
				}

				localVideoElement.srcObject = isMediaStreamEmpty(localStream) ? null : localStream;

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
				const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: !isMicOn });
				const screenTrack = screenStream.getVideoTracks()[0];

				if (!screenTrack) return false;

				const cameraTrack = localStream.getVideoTracks()[0];

				if (cameraTrack) {
					cameraTrack.stop();
					localStream.removeTrack(cameraTrack);
					setIsCameraOn(false);
				}

				await attachTrack(screenTrack, localStream);

				/* The browser can stop screen sharing without going through this toggle (for example, when the user clicks "Stop sharing" in the browser UI). Keep our React state in sync with that. */
				screenTrack.addEventListener("ended", () => {
					void getSenderForKind("video")?.replaceTrack(null);
					localStream.removeTrack(screenTrack);
					videoElement.srcObject = isMediaStreamEmpty(localStream) ? null : localStream;

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
					await getSenderForKind("video")?.replaceTrack(null);
				}

				videoElement.srcObject = isMediaStreamEmpty(localStream) ? null : localStream;
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
			const localStream = getOrCreateStream();
			const microphoneTrack = localStream.getAudioTracks()[0];

			if (!microphoneTrack) {
				if (isMicOn) return;

				const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
				const audioTrack = microphoneStream.getAudioTracks()[0];
				if (!audioTrack) return;

				localStream.addTrack(audioTrack);
				await attachTrack(audioTrack, localStream);
				setIsMicOn(true);
				return;
			}

			microphoneTrack.enabled = !isMicOn;
			setIsMicOn(!isMicOn);
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
