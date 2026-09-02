import { useRef } from "react";
import { Mic, MonitorUp, PhoneOff, Video, Volume2 } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import MeetingInfo from "../components/MeetingInfo";
import VideoParticipant from "../components/VideoParticipant";
import formatUserName from "@/utils/formatUserName";

const VideoCall = () => {
	const { user: currentUser } = useCurrentUser();

	const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
	const localVideoRef = useRef<HTMLVideoElement | null>(null);

	const toggleScreenSharing = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
			const videoElement = localVideoRef.current;

			if (!videoElement) return;

			videoElement.srcObject = mediaStream;
		} catch (err) {
			console.error(err);
		}
	};

	const toggleVideoSharing = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			const videoElement = localVideoRef.current;

			if (!videoElement) return;

			videoElement.srcObject = mediaStream;
		} catch (err) {
			console.error(err);
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
					<video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover absolute top-0 left-0"></video>
				</VideoParticipant>

				{/* Local video */}
				<VideoParticipant fullName={formatUserName(currentUser?.name)} style={{ width: "50%" }}>
					<video ref={localVideoRef} autoPlay playsInline className="w-full h-full object-cover absolute top-0 left-0"></video>
				</VideoParticipant>
			</div>

			{/* Call Action Buttons */}
			<div className="flex justify-center items-center gap-5 bg-slate-100/70 rounded-3xl p-5 border border-slate-200 w-fit m-auto">
				<button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80 transition-colors p-4 rounded-full cursor-pointer">
					<Mic size={20} />
				</button>
				<button onClick={toggleVideoSharing} className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80 transition-colors p-4 rounded-full cursor-pointer">
					<Video size={20} />
				</button>
				<button onClick={toggleScreenSharing} className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80 transition-colors p-4 rounded-full cursor-pointer">
					<MonitorUp size={20} />
				</button>
				<button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80 transition-colors p-4 rounded-full cursor-pointer">
					<Volume2 size={20} />
				</button>
				<button className="bg-red-500 text-white hover:bg-red-700 active:bg-red-800 p-4 rounded-full cursor-pointer">
					<PhoneOff size={20} />
				</button>
			</div>
		</div>
	);
};

export default VideoCall;
