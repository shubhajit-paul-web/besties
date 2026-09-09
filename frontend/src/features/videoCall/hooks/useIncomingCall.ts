import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { OfferPayload } from "../types/videoCall.types";
import useAppContext from "@/hooks/useAppContext";
import useRingtone from "./useRingtone";
import useWebRTC from "@/hooks/useWebRTC";
import socket from "@/lib/socket";

const useIncomingCall = () => {
	const navigate = useNavigate();
	const { videoCallCommunication } = useAppContext();
	const { cleanupVideoCall } = useWebRTC();
	const { playRingtone, stopRingtone } = useRingtone();
	const [incomingCall, setIncomingCall] = useState<OfferPayload | null>(null);

	const { videoCallOfferPayloadRef: offerPayloadRef, setVideoCallSenderInfo: setSenderInfo, videoCallStatusRef: callStatusRef, updateVideoCallStatus } = videoCallCommunication;

	const rejectIncomingCall = useCallback(() => {
		if (callStatusRef.current !== "incoming") return;

		// Tell the caller we declined before clearing the incoming call state.
		socket.emit("cancel-call", {
			to: offerPayloadRef.current?.from._id,
		});

		stopRingtone();
		updateVideoCallStatus("rejected");
		offerPayloadRef.current = null;
		setIncomingCall(null);
	}, [callStatusRef, offerPayloadRef, setIncomingCall, stopRingtone, updateVideoCallStatus]);

	const acceptIncomingCall = useCallback(async () => {
		stopRingtone();

		const offerPayload = offerPayloadRef.current;
		if (!offerPayload) return;

		const sender = offerPayload.from;

		// The call page uses the offer to finish the WebRTC handshake.
		setIncomingCall(null);
		await navigate(`/app/video-call/${sender._id}`, {
			state: {
				incomingCall: true,
				offerPayload,
			},
		});
	}, [navigate, offerPayloadRef, setIncomingCall, stopRingtone]);

	const onOfferListener = useCallback(
		(payload: OfferPayload) => {
			if (!payload) return;

			offerPayloadRef.current = payload;
			setSenderInfo(payload.from);
			updateVideoCallStatus("incoming");
			setIncomingCall(payload);
			playRingtone("incoming");
		},
		[offerPayloadRef, playRingtone, setIncomingCall, setSenderInfo, updateVideoCallStatus],
	);

	const onCancelCallListener = useCallback(() => {
		if (callStatusRef.current === "calling") {
			// The person we called declined, so end our outgoing call too.
			toast.info("Call declined", {
				theme: "colored",
			});

			playRingtone("canceled", false);

			setTimeout(() => {
				updateVideoCallStatus("rejected");
			}, 1000);

			cleanupVideoCall();
		} else if (callStatusRef.current === "incoming") {
			// The caller canceled while the incoming call was still ringing.
			stopRingtone();
			setIncomingCall(null);
			updateVideoCallStatus("rejected");
		}
	}, [callStatusRef, cleanupVideoCall, playRingtone, setIncomingCall, stopRingtone, updateVideoCallStatus]);

	// Socket.io listeners
	useEffect(() => {
		socket.on("offer", onOfferListener);
		socket.on("cancel-call", onCancelCallListener);

		return () => {
			socket.off("offer", onOfferListener);
			socket.off("cancel-call", onCancelCallListener);
		};
	}, [onCancelCallListener, onOfferListener]);

	return {
		incomingCall,
		acceptIncomingCall,
		rejectIncomingCall,
		stopIncomingCallRingtone: stopRingtone,
	};
};

export default useIncomingCall;
