import { CircleX, Mic } from "lucide-react"
import MeetingInfo from "../shared/VideoCallManager/MeetingInfo"

const AudioCallManager = () => {
	return (
		<div>
			<div className="mb-3">
				<MeetingInfo meetingId="WAHB4546790DS" sessionLength="00:12:45" />
			</div>

			<div className="grid grid-cols-2 gap-15">
				<div className="bg-slate-100/80 px-5 py-10 rounded-3xl flex flex-col items-center gap-8">
					<img className="w-35 aspect-square object-cover rounded-full border-4 border-green-500/90 shadow-[0_0_0_8px] shadow-green-500/15" src="/public/profile-img.jpeg" />
					<div>
						<div className="text-lg font-semibold text-slate-800 flex items-center gap-2">
							<span>Shubhajit Paul</span>
							<span className="text-xs bg-slate-200 text-slate-600 py-0.5 px-2 rounded-md border border-slate-300">ME</span>
						</div>
						<div className="text-center mt-2">
							<div className="text-green-600 font-medium">Speaking...</div>
						</div>
					</div>
				</div>
				<div className="bg-slate-100/80 px-5 py-10 rounded-3xl flex flex-col items-center gap-5">
					<img className="w-35 aspect-square object-cover rounded-full" src="/public/profile-img.jpeg" />
					<div className="text-lg font-semibold text-slate-800">Shubhajit Paul</div>
				</div>
			</div>

			<div className="flex justify-between items-center mt-8">
				<div className="flex justify-center items-center gap-3 bg-slate-100 rounded-full p-2">
					<button className="bg-amber-500 text-white p-4 rounded-full cursor-pointer">
						<Mic size={20} />
					</button>
					<div className="text-xs font-medium bg-green-200 text-green-600 w-fit py-0.5 px-2 rounded-md leading-tight border border-green-300/60 cursor-default">ON</div>
				</div>
				<div>
					<button className="bg-red-500 hover:bg-red-700/85 transition-all text-white py-4 px-6 rounded-xl cursor-pointer flex items-center gap-2.5 leading-0">
						<CircleX size={20} />
						End
					</button>
				</div>
			</div>
		</div>
	)
}

export default AudioCallManager