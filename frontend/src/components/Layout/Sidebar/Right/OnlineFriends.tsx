import { Link } from "react-router-dom";
import Avatar from "../../../ui/Avatar";
import Card from "../../../ui/Card";
import { MessageSquareMore, Phone, Video } from "lucide-react";
import useOnlineFriends from "@/hooks/useOnlineFriends";
import { Empty, Tooltip } from "antd";
import formatUserName from "@/utils/formatUserName";

const OnlineFriends = ({ height = "55%" }: { height?: string }) => {
	const friends = useOnlineFriends();

	return (
		<Card title="Online Friends" height={height}>
			<div
				className="mt-3 space-y-1 overflow-y-auto"
				style={{
					height: `calc(100% - 50px)`,
				}}>
				{friends.length === 0 ? (
					<div className="h-full flex justify-center items-center">
						<Empty description="No friends are online right now" />
					</div>
				) : (
					<>
						{friends.map((friend, index) => (
							<div key={index} className="flex justify-between items-center py-2.5 px-5 transition-all hover:bg-slate-50 hover:-translate-y-px">
								<Avatar
									image={friend.avatar || "/profile-img.jpeg"}
									title={formatUserName(friend.name)}
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
									<Link to={`/app/chat/${friend._id}`}>
										<Tooltip title="Chat">
											<button className="cursor-pointer hover:border-blue-500 transition-all text-blue-600 bg-blue-100/80 border border-blue-200 rounded-full p-1.5">
												<MessageSquareMore size={14} />
											</button>
										</Tooltip>
									</Link>
									<Link to={`/app/audio-call/${friend._id}`}>
										<Tooltip title="Audio call">
											<button className="cursor-pointer hover:border-green-500 transition-all text-gray-600 bg-gray-100 border border-gray-200 rounded-full p-1.5">
												<Phone size={14} />
											</button>
										</Tooltip>
									</Link>
									<Link to={`/app/video-call/${friend._id}`}>
										<Tooltip title="Video Call">
											<button className="cursor-pointer hover:border-amber-500 transition-all text-gray-600 bg-gray-100 border border-gray-200 rounded-full p-1.5">
												<Video size={14} />
											</button>
										</Tooltip>
									</Link>
								</div>
							</div>
						))}
					</>
				)}
			</div>
		</Card>
	);
};

export default OnlineFriends;
