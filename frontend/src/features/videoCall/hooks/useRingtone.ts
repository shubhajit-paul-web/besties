import { useRef, useEffect, useCallback } from "react";
import outgoingRing from "@/assets/audio/phone-ringing.mp3";
import incomingRing from "@/assets/audio/incoming-call-ringtone.mp3";
import canceledRing from "@/assets/audio/call-reject-ringtone.wav";

const SOUNDS = {
	calling: outgoingRing,
	incoming: incomingRing,
	canceled: canceledRing,
};

// Ringing audio playback & unmount cleanup
const useRingtone = () => {
	const playerRef = useRef<HTMLAudioElement | null>(null);

	const stop = useCallback(() => {
		if (playerRef.current) {
			playerRef.current.pause();
			playerRef.current.currentTime = 0;
		}
	}, []);

	const play = useCallback(
		(type: keyof typeof SOUNDS, loop = true) => {
			stop();
			if (!playerRef.current) {
				playerRef.current = new Audio();
			}
			playerRef.current.src = SOUNDS[type];
			playerRef.current.loop = loop;
			playerRef.current.play().catch(() => {});
		},
		[stop],
	);

	useEffect(() => {
		return () => stop();
	}, [stop]);

	return { playRingtone: play, stopRingtone: stop };
};

export default useRingtone;
