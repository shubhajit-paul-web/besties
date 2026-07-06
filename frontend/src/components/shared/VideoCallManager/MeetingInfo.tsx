import { Clock } from "lucide-react"

const MeetingInfo = () => {
	return (
		<div className="flex items-center justify-between">
			<div className="bg-slate-100 w-fit py-1.5 px-5 rounded-xl text-sm">
				<span className="font-medium">Meeting ID: </span>
				KHAB487605AW
			</div>

			<div className="bg-slate-100 w-fit py-1.5 px-5 rounded-xl text-sm flex items-center gap-2 cursor-default">
				<Clock size={16} />
				<span>00:12:45</span>
			</div>
		</div>
	)
}

export default MeetingInfo