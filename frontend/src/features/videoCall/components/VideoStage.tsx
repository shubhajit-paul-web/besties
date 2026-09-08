import { ArrowLeftRight } from "lucide-react";
import VideoParticipant from "./VideoParticipant";
import type { VideoStageProps } from "../types/videoCall.types";

const VideoStage = ({ remoteVideoRef, localVideoRef, localAudioRef, remoteName, localName, isLocalPinned, onSwap }: VideoStageProps) => {
	const primaryParticipantClassName = "absolute inset-0 h-full w-full rounded-[1.25rem] transition-[inset,width,height] duration-300 ease-out";
	const previewParticipantClassName = "absolute bottom-4 right-4 z-10 aspect-video rounded-xl border-2 border-white/15 shadow-xl transition-[inset,width,height] duration-300 ease-out";

	return (
		<section className="relative isolate aspect-video w-full overflow-hidden rounded-[1.25rem] bg-slate-950">
			{/* shadow-[0_20px_60px_-30px_rgba(15,23,42,0.45)] */}
			<VideoParticipant
				fullName={isLocalPinned ? localName : remoteName}
				className={primaryParticipantClassName}
				style={{
					inset: 0,
					zIndex: 0,
				}}>
				<video ref={isLocalPinned ? localVideoRef : remoteVideoRef} autoPlay playsInline muted={isLocalPinned} className="absolute left-0 top-0 h-full w-full object-cover" />
			</VideoParticipant>

			<VideoParticipant
				fullName={isLocalPinned ? remoteName : localName}
				className={previewParticipantClassName}
				style={{
					zIndex: 20,
					width: "clamp(12rem, 30%, 20rem)",
				}}>
				<video ref={isLocalPinned ? remoteVideoRef : localVideoRef} autoPlay playsInline muted={!isLocalPinned} className="absolute left-0 top-0 h-full w-full object-cover" />
				<audio ref={localAudioRef} autoPlay playsInline muted />
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
