import { ArrowLeftRight } from "lucide-react";
import VideoParticipant from "./VideoParticipant";
import type { VideoStageProps } from "../types/videoCall.types";
import useAppContext from "@/hooks/useAppContext";
import { useEffect } from "react";

const VideoStage = ({ remoteName, localName, isLocalPinned, onSwap }: VideoStageProps) => {
	const { videoCallCommunication } = useAppContext();

	const {
		videoCallRemoteVideoRef: remoteVideoRef,
		videoCallRemoteStreamRef: remoteStreamRef,
		videoCallLocalVideoRef: localVideoRef,
		videoCallRemoteMediaState: remoteMediaState,
	} = videoCallCommunication;

	const primaryParticipantClassName = "absolute inset-0 h-full w-full rounded-[1.25rem] transition-[inset,width,height] duration-300 ease-out";
	const previewParticipantClassName = "absolute bottom-4 right-4 z-10 aspect-video rounded-xl border-2 border-white/15 shadow-xl transition-[inset,width,height] duration-300 ease-out";

	useEffect(() => {
		const remoteVideoElement = remoteVideoRef.current;
		if (!remoteVideoElement) return;

		const { video, audio, screenShare } = remoteMediaState;
		const remoteStream = remoteStreamRef.current;
		const hasLiveRemoteTrack = remoteStream?.getTracks().some((track) => track.readyState !== "ended") ?? false;

		if (video || audio || screenShare || hasLiveRemoteTrack) {
			remoteVideoElement.srcObject = remoteStream;
		} else {
			remoteVideoElement.srcObject = null;
		}
	}, [remoteMediaState, remoteStreamRef, remoteVideoRef]);

	return (
		<section className="relative isolate aspect-video w-full overflow-hidden rounded-[1.25rem] bg-slate-950">
			{/* Remote video */}
			<VideoParticipant
				isRemote={true}
				fullName={remoteName}
				className={primaryParticipantClassName}
				style={{
					inset: 0,
					zIndex: 0,
				}}>
				<video ref={remoteVideoRef} autoPlay playsInline className="absolute left-0 top-0 h-full w-full object-cover" />
			</VideoParticipant>

			{/* Local video */}
			<VideoParticipant
				isRemote={false}
				fullName={localName}
				className={previewParticipantClassName}
				style={{
					zIndex: 20,
					width: "clamp(12rem, 30%, 20rem)",
				}}>
				<video ref={localVideoRef} autoPlay playsInline muted className="absolute left-0 top-0 h-full w-full object-cover" />
			</VideoParticipant>

			<button
				type="button"
				onClick={onSwap}
				aria-label={isLocalPinned ? "Show remote video full screen" : "Show local video full screen"}
				title="Swap video layout"
				className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-slate-950/70 text-white backdrop-blur transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-white/70">
				<ArrowLeftRight size={17} strokeWidth={2.2} />
			</button>
		</section>
	);
};

export default VideoStage;
