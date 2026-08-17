import { Clock } from "lucide-react"

interface MeetingInfoInterface {
	meetingId?: string
	sessionLength?: string
}

const MeetingInfo = ({ meetingId, sessionLength }: MeetingInfoInterface) => {
	return (
		<div className="flex items-center justify-between">
			{
				meetingId &&
				<div className="bg-slate-100 w-fit py-1.5 px-5 rounded-xl text-sm">
					<span className="font-medium">Meeting ID: </span>
					{meetingId}
				</div>
			}
			{
				sessionLength &&
				<div className="bg-slate-100 w-fit py-1.5 px-5 rounded-xl text-sm flex items-center gap-2 cursor-default">
					<Clock size={16} />
					<span>{sessionLength}</span>
				</div>
			}
		</div>
	)
}

export default MeetingInfo