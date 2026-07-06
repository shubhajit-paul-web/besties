import { CircleX, Mic } from "lucide-react"

const AudioCallManager = () => {
	return (
		<div>

			<div className="grid grid-cols-2 gap-20">
				<div className="bg-slate-100 px-5 py-8 rounded-xl flex flex-col items-center gap-8">
					<div className="text-lg font-semibold text-slate-600">Shubhajit Paul (Me)</div>
					<img className="w-30 h-30 object-cover rounded-full" src="/public/profile-img.jpeg" />
				</div>
				<div className="bg-slate-100 px-5 py-8 rounded-xl flex flex-col items-center gap-8">
					<div className="text-lg font-semibold text-slate-600">Avinash Kumar</div>
					<img className="w-30 h-30 object-cover rounded-full" src="/public/profile-img.jpeg" />
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