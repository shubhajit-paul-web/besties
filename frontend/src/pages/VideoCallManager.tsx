import { Maximize2, Mic, MonitorUp, PhoneOff, Video, Volume2 } from "lucide-react"
import MeetingInfo from "../shared/VideoCallManager/MeetingInfo"

const VideoCallManager = () => {
	return (
		<div>
			{/* Meeting info */}
			<MeetingInfo meetingId="WAHB4546790DS" sessionLength="00:12:45" />

			{/* Video */}
			<div className="bg-black w-full h-0 pb-[56.25%] relative rounded-2xl overflow-hidden mt-3 mb-5">
				<video className="w-full h-full absolute top-0 left-0"></video>

				{/* Avatar */}
				<div className="border-2 border-slate-700 rounded-full w-fit p-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
					<div className="w-35 h-35 overflow-hidden rounded-full">
						<img className="w-full h-full object-cover" src="/public/profile-img.jpeg" />
					</div>
				</div>

				{/* Animated shadow */}
				<div className="w-10 h-10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_150px_120px] shadow-blue-200/35 animate-pulse"></div>

				<div className="bg-slate-800/70 text-xs text-slate-100 w-fit py-1 px-3 rounded-lg absolute bottom-5 left-5 cursor-default flex items-center gap-2">
					{/* <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>  */}
					Shubhajit Paul
				</div>
				<button className="bg-slate-800/70 text-slate-100 absolute bottom-4 right-5 p-2 rounded-lg cursor-pointer hover:scale-110 transition-all" title="Full Screen">
					<Maximize2 size={16} />
				</button>
			</div>

			{/* Call Action Buttons */}
			<div className="flex justify-center items-center gap-5 bg-slate-100/70 rounded-3xl p-5 border border-slate-200 w-fit m-auto">
				<button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80 transition-colors p-4 rounded-full cursor-pointer">
					<Mic size={20} />
				</button>
				<button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80 transition-colors p-4 rounded-full cursor-pointer">
					<Video size={20} />
				</button>
				<button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80 transition-colors p-4 rounded-full cursor-pointer">
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
	)
}

export default VideoCallManager