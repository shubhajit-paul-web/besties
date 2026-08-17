interface UserCardInterface {
	type: "self" | "other"
	isSpeaking: boolean
	username: string
	profileImage: string
}

const UserCard = ({ type, isSpeaking, username, profileImage }: UserCardInterface) => {
	return (
		<div className="bg-white border-2 border-slate-200/70 px-5 py-10 rounded-2xl flex flex-col items-center gap-5">
			<div className="relative isolate">
				{/* Avatar Outer glow */}
				{
					isSpeaking &&
					<div className="w-28 aspect-square bg-green-500/80 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 animate-ping"></div>
				}

				{/* Avatar */}
				<img className="relative z-10 w-45 aspect-square object-cover rounded-full" src={profileImage} />
			</div>
			<div className="flex flex-col items-center gap-3">
				<div className="text-xl font-semibold text-slate-800 flex items-center gap-2">
					<span>{username}</span>
					{
						type === "self" &&
						<span className="text-xs bg-slate-200 text-slate-600 py-0.5 px-2 rounded-md border border-slate-300">You</span>
					}
				</div>
				<div className="w-fit bg-[#DCFCE7] text-green-600 py-0.5 px-3 rounded-full font-medium flex items-center gap-1.5 text-center">
					<div className="w-1 h-1 bg-green-500 rounded-full animate-ping"></div>
					<span className="leading-tight text-xs">Speaking</span>
				</div>
			</div>
		</div>
	)
}

export default UserCard