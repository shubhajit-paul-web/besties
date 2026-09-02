import { useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

interface VideoParticipantProps extends ComponentProps<"div"> {
	fullName: string;
	children: ReactNode;
}

const VideoParticipant = ({ fullName, children, ...props }: VideoParticipantProps) => {
	const [isFullscreen, setIsFullscreen] = useState(false);
	const videoContainerRef = useRef<HTMLDivElement | null>(null);

	const toggleFullscreen = async () => {
		const videoContainerElement = videoContainerRef.current;

		if (!videoContainerElement) return;

		if (document.fullscreenElement) {
			await document.exitFullscreen();
			setIsFullscreen(false);
		} else {
			await videoContainerElement.requestFullscreen();
			setIsFullscreen(true);
		}
	};

	return (
		<div ref={videoContainerRef} className="bg-black w-full aspect-video relative rounded-2xl overflow-hidden mt-3 mb-5" {...props}>
			{children}

			{/* <video ref={videoRef} className="w-full h-full absolute top-0 left-0"></video> */}

			{/* Avatar */}
			{/* <div className="absolute top-1/2 left-1/2 z-10 aspect-square w-1/4 max-w-30 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-slate-700 p-1">
				<div className="h-full w-full overflow-hidden rounded-full">
					<img className="w-full h-full object-cover" src="/profile-img.jpeg" loading="lazy" />
				</div>
			</div> */}

			{/* Animated shadow */}
			{/* <div className="w-10 h-10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_150px_120px] shadow-blue-200/25 animate-pulse"></div> */}

			<div className="capitalize bg-slate-800/70 text-xs text-slate-100 w-fit py-1 px-3 rounded-lg absolute bottom-4 left-4 cursor-default flex items-center gap-2">
				{/* <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div> */}
				{fullName}
			</div>

			<button onClick={toggleFullscreen} className="bg-slate-800/70 text-slate-100 absolute bottom-4 right-4 p-2 rounded-lg cursor-pointer hover:scale-110 transition-all">
				{isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
			</button>
		</div>
	);
};

export default VideoParticipant;
