import { MessageSquareMore, Phone, Video } from "lucide-react"
import Avatar from "../Avatar"
import { Link } from "react-router-dom"

const RightSidebar = ({ rightSidebarWidth }: { rightSidebarWidth: number }) => {
	return (
		<aside className={`w-[${rightSidebarWidth}px] h-screen p-8 fixed top-0 right-0`} style={{ width: rightSidebarWidth + "px" }}>
			<div className="h-full bg-slate-50 border-l border-slate-200 rounded-xl py-5">
				<div className="font-medium text-lg pb-4 px-5">My Friends</div>
				<div className="w-[90%] border-b border-b-slate-200 m-auto"></div>
				<div className=" mt-5 space-y-1 overflow-y-auto" style={{
					height: `calc(100% - 60px)`
				}}>
					{
						Array(20).fill(0).map(() => (
							<div className="flex justify-between items-center py-3 px-5 rounded-lg hover:bg-slate-200/50">
								<Avatar
									image="/profile-img.jpeg"
									title="Avinash Kumar"
									subtitle={
										<div className="flex items-center gap-1 mt-0.5">
											<div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
											<span className="opacity-70">Online</span>
										</div>
									}
								/>

								{/* Actions */}
								<div className="flex items-center gap-2.5">
									<Link to="/app/chat">
										<button className="cursor-pointer hover:border-blue-500 transition-all text-blue-600 bg-blue-100/80 border border-blue-200 rounded-full p-1.5" title="Chat">
											<MessageSquareMore size={15} />
										</button>
									</Link>
									<Link to="/app/audio-call">
										<button className="cursor-pointer hover:border-green-500 transition-all text-green-600 bg-green-100/80 border border-green-300/50 rounded-full p-1.5" title="Audio Call">
											<Phone size={15} />
										</button>
									</Link>
									<Link to="/app/video-call" className="cursor-pointer hover:border-amber-500 transition-all text-amber-600 bg-amber-100/80 border border-amber-300/90 rounded-full p-1.5" title="Video Call">
										<Video size={15} />
									</Link>
								</div>
							</div>
						))
					}
				</div>
			</div>
		</aside>
	)
}

export default RightSidebar