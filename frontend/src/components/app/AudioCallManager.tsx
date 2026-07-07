import { Mic, PhoneOff, Volume2 } from "lucide-react"
import MeetingInfo from "../shared/VideoCallManager/MeetingInfo"
import UserCard from "../shared/AudioCallManager/UserCard"

const AudioCallManager = () => {
	return (
		<div>
			<div className="mb-3">
				<MeetingInfo meetingId="WAHB4546790DS" sessionLength="00:12:45" />
			</div>

			<div className="grid grid-cols-2 gap-5 bg-slate-100 p-5 rounded-3xl">
				<UserCard
					type="self"
					isSpeaking={true}
					username="Shubhajit Paul"
					profileImage="/public/profile-img.jpeg"
				/>
				<UserCard
					type="other"
					isSpeaking={false}
					username="Aanya Paul"
					profileImage="https://plus.unsplash.com/premium_photo-1688350808212-4e6908a03925?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
				/>
			</div>

			{/* Call Action Buttons  */}
			<div className="flex justify-between items-center mt-8">
				<div className="flex justify-center items-center gap-5 bg-slate-100/70 rounded-3xl p-5 border border-slate-200 m-auto">
					<button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80 transition-colors p-4 rounded-full cursor-pointer">
						<Mic size={20} />
					</button>
					<button className="bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80 transition-colors p-4 rounded-full cursor-pointer">
						<Volume2 size={20} />
					</button>
					<button className="bg-red-500 text-white hover:bg-red-700 active:bg-red-800 p-4 rounded-full cursor-pointer">
						<PhoneOff size={20} />
					</button>
				</div>

				{/* <div>
					<Button variant="danger" icon={CircleX} className="py-4 px-6 rounded-xl">End</Button>
				</div> */}
			</div>
		</div>
	)
}

export default AudioCallManager