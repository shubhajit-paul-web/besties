import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import type { VideoParticipantProps } from "../types/videoCall.types";
import useAppContext from "@/hooks/useAppContext";

const VideoParticipant = ({ fullName, isRemote, children, className, ...props }: VideoParticipantProps) => {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const videoContainerRef = useRef<HTMLDivElement | null>(null);
	const { videoCallCommunication } = useAppContext();
	const { videoCallRemoteMediaState: remoteMediaState, videoCallStatus: callStatus } = videoCallCommunication;

	useEffect(() => {
		const syncFullscreenState = () => {
			setIsFullscreen(document.fullscreenElement === videoContainerRef.current);
		};

		document.addEventListener("fullscreenchange", syncFullscreenState);
		syncFullscreenState();

		return () => document.removeEventListener("fullscreenchange", syncFullscreenState);
	}, []);

	const toggleFullscreen = async () => {
		const videoContainerElement = videoContainerRef.current;

		if (!videoContainerElement || !document.fullscreenEnabled) return;

		try {
			if (document.fullscreenElement === videoContainerElement) {
				await document.exitFullscreen();
			} else {
				await videoContainerElement.requestFullscreen();
			}
		} catch {
			setIsFullscreen(document.fullscreenElement === videoContainerElement);
		}
	};

	return (
		<div ref={videoContainerRef} className={`overflow-hidden rounded-2xl bg-black ${className ?? ""}`} {...props}>
			{children}

			{/* <video ref={videoRef} className="w-full h-full absolute top-0 left-0"></video> */}

			{/* Avatar */}
			{isRemote && callStatus === "connected" && !remoteMediaState.video && (
				<div className="absolute top-1/2 left-1/2 z-10 aspect-square w-1/4 max-w-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-700 p-1">
					<div className="h-full w-full overflow-hidden rounded-full">
						<img className="w-full h-full object-cover" src="/profile-img.jpeg" loading="lazy" />
					</div>
				</div>
			)}

			{/* Animated shadow */}
			{/* <div className="w-10 h-10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_150px_120px] shadow-blue-200/25 animate-pulse"></div> */}

			<div className="capitalize bg-slate-800/70 text-xs text-slate-100 w-fit py-1 px-3 rounded-lg absolute bottom-3 left-3 cursor-default flex items-center gap-2">
				{isRemote && remoteMediaState.audio && <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>}
				{fullName}
			</div>

			<button
				type="button"
				onClick={(event) => {
					event.stopPropagation();
					toggleFullscreen();
				}}
				aria-label={`${isFullscreen ? "Exit" : "View"} ${fullName}'s video ${isFullscreen ? "fullscreen" : "in fullscreen"}`}
				aria-pressed={isFullscreen}
				title={`${isFullscreen ? "Exit" : "View"} ${fullName}'s video fullscreen`}
				className="absolute bottom-2.5 right-2.5 rounded-lg bg-slate-800/70 p-2 text-slate-100 transition-all hover:scale-110">
				{isFullscreen ? <Minimize2 size={13} strokeWidth={2.2} /> : <Maximize2 size={13} strokeWidth={2.2} />}
			</button>
		</div>
	);
};

export default VideoParticipant;
