import { MessageSquareMore, Phone, UserRoundPlus, Video } from "lucide-react"
import Avatar from "../Avatar"
import { Link } from "react-router-dom"
import Button from "../Button"
import Card from "./Card"

const RightSidebar = ({ rightSidebarWidth }: { rightSidebarWidth: number }) => {
	return (
		<aside className={`w-[${rightSidebarWidth}px] h-screen p-8 fixed top-0 right-0`} style={{ width: rightSidebarWidth + "px" }}>
			<div className="h-full bg-slate-50 border-l border-slate-100 rounded-xl py-5 px-5 flex flex-col gap-4">
				{/* Suggested friends */}
				<Card title="Suggested" height="43%">
					<div className="mt-3 space-y-1 overflow-y-auto" style={{
						height: `calc(100% - 52px)`
					}}>
						{
							Array(10).fill(0).map(() => (
								<div className="py-3 px-5 rounded-lg hover:bg-slate-50">
									<Avatar
										image="/profile-img.jpeg"
										imageShape="square"
										imageSize={56}
										title="Avinash Kumar"
										subtitle={
											<div className="flex items-center gap-1 mt-3">
												<Button
													variant="success"
													icon={UserRoundPlus}
													iconSize={13}
													style={{ padding: "5px 10px", borderRadius: "6px" }}>
													Add Friend
												</Button>
											</div>
										}
									/>
								</div>
							))
						}
					</div>
				</Card>

				{/* My friends */}
				<Card title="My Friends" height="55%">
					<div className="mt-3 space-y-1 overflow-y-auto" style={{
						height: `calc(100% - 50px)`
					}}>
						{
							Array(20).fill(0).map(() => (
								<div className="flex justify-between items-center py-2.5 px-5 transition-all hover:bg-slate-50 hover:-translate-y-px">
									<Avatar
										image="/profile-img.jpeg"
										title="Avinash Kumar"
										imageSize={40}
										subtitle={
											<div className="flex items-center gap-1 mt-0.5">
												<div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
												<span className="opacity-70">Active now</span>
											</div>
										}
									/>

									{/* Actions */}
									<div className="flex items-center gap-2 border border-slate-200/60 rounded-full py-1 px-1">
										<Link to="/app/chat">
											<button className="cursor-pointer hover:border-blue-500 transition-all text-blue-600 bg-blue-100/80 border border-blue-200 rounded-full p-1.5" title="Chat">
												<MessageSquareMore size={14} />
											</button>
											{/* <button className="cursor-pointer hover:border-blue-500 transition-all text-slate-600 bg-slate-100/80 border border-slate-200 rounded-full p-1.5" title="Chat">
												<MessageSquareMore size={14} />
											</button> */}
										</Link>
										<Link to="/app/audio-call">
											<button className="cursor-pointer hover:border-green-500 transition-all text-gray-600 bg-gray-100 border border-gray-200 rounded-full p-1.5" title="Audio Call">
												<Phone size={14} />
											</button>
										</Link>
										<Link to="/app/video-call" className="cursor-pointer hover:border-amber-500 transition-all text-gray-600 bg-gray-100 border border-gray-200 rounded-full p-1.5" title="Video Call">
											<Video size={14} />
										</Link>
									</div>
								</div>
							))
						}
					</div>
				</Card>
			</div>
		</aside>
	)
}

export default RightSidebar