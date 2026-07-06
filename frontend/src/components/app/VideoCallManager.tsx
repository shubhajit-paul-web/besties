import { CircleX, Maximize2, Mic, MonitorUp, Video } from "lucide-react"

const VideoCallManager = () => {
	return (
		<div className="space-y-6">
			<div className="bg-black w-full h-0 pb-[56.25%] relative rounded-2xl overflow-hidden">
				<video className="w-full h-full absolute top-0 left-0"></video>

				{/* Avatar */}
				<div className="border-2 border-slate-700 rounded-full w-fit p-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_100px_30px] shadow-slate-200/30">
					<div className="w-35 h-35 overflow-hidden rounded-full">
						<img className="w-full h-full object-cover" src="/public/profile-img.jpeg" />
					</div>
				</div>

				<div className="bg-slate-800/70 text-xs text-slate-100 w-fit py-1 px-3 rounded-lg absolute bottom-5 left-5 cursor-default flex items-center gap-2">
					{/* <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>  */}
					Shubhajit Paul
				</div>
				<button className="bg-slate-800/70 text-slate-100 absolute bottom-4 right-5 p-2 rounded-lg cursor-pointer hover:scale-110 transition-all" title="Full Screen">
					<Maximize2 size={16} />
				</button>
			</div>

			{/* Action buttons - container */}
			<div className="flex justify-between">
				<div className="flex items-center gap-6">
					<div className="flex flex-col justify-center items-center">
						<button className="bg-green-500 text-white p-4 rounded-full cursor-pointer">
							<Video size={20} />
						</button>
						<div className="text-sm my-1">Camera</div>
						<div className="text-xs font-medium bg-green-200/60 text-green-600 w-fit py-0.5 px-2 rounded-md leading-tight">On</div>
					</div>
					<div className="flex flex-col justify-center items-center">
						<button className="bg-amber-500 text-white p-4 rounded-full cursor-pointer">
							<Mic size={20} />
						</button>
						<div className="text-sm my-1">Mic</div>
						<div className="text-xs font-medium bg-green-200/60 text-green-600 w-fit py-0.5 px-2 rounded-md leading-tight">On</div>
					</div>
					<div className="flex flex-col justify-center items-center">
						<button className="bg-blue-500 text-white p-4 rounded-full cursor-pointer">
							<MonitorUp size={20} />
						</button>
						<div className="text-sm my-1">Share</div>
						<div className="text-xs font-medium bg-red-200/70 text-red-500 w-fit py-0.5 px-2 rounded-md leading-tight">Off</div>
					</div>
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

export default VideoCallManager