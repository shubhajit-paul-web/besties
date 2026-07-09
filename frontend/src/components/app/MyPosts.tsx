import { EarthIcon, Ellipsis, MessageCircle, Share, ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import Avatar from "../shared/Avatar";
import IconButton from "../shared/IconButton";
import Button from "../shared/Button";
import { useState } from "react";

const MyPosts = () => {
	const [showFullCaption, setShowFullCaption] = useState(false);

	// Demo caption for testing
	const caption = "Knowledge Debt may become the next Technical Debt. Technical debt builds up when we take shortcuts in code. Knowledge debt builds up when we take shortcuts in learning.";

	// Caption length limit to show by default
	const captionLimit = 80;

	const cropCaption = (caption: string) => {
		if (caption.length <= captionLimit) return caption;

		if (!showFullCaption) {
			return caption.slice(0, captionLimit + 1) + "...";
		}

		return caption;
	};

	return (
		<div className="bg-slate-50 p-5 rounded-2xl flex flex-col items-center gap-5">
			{Array(5)
				.fill(0)
				.map(() => (
					<div className="w-150 bg-white border border-slate-200 rounded-xl">
						<div className="p-3">
							{/* Creator info */}
							<div className="flex justify-between items-center">
								<Avatar
									image="/public/profile-img.jpeg"
									imageSize={40}
									imageShape="full"
									title="Shubhajit Paul"
									subtitle={
										<div className="text-slate-600 flex items-center gap-1 mt-1.5">
											<span>2 April 2026</span>
											<span>&#183;</span>
											<EarthIcon size={13} />
										</div>
									}
								/>

								<IconButton variant="default" icon={Ellipsis} />
							</div>

							{/* Caption */}
							<p className="leading-tight py-2.5 text-slate-800">
								{cropCaption(caption)}
								{caption.length > captionLimit && (
									<button onClick={() => setShowFullCaption(!showFullCaption)} className="font-medium hover:underline ml-1.5">
										{showFullCaption ? "See less" : "See more"}
									</button>
								)}
							</p>
						</div>

						<div className="w-full max-h-160 overflow-hidden">
							<img
								className="w-full select-none"
								src="https://cdnb.artstation.com/p/assets/images/images/079/205/017/large/sourav-ghosh-back-to-school-x-media-post-template-design-07.jpg?1724262273"
								draggable="false"
								alt="Post image"
							/>
						</div>

						{/* Post interaction and views count */}
						<div className="p-1.5 opacity-85 flex justify-between items-center">
							<div className="flex items-center">
								<Button variant="transparent" icon={ThumbsUpIcon} iconSize={19} style={{ paddingInline: "12px" }}>
									<span className="text-sm">15k</span>
								</Button>
								<Button variant="transparent" icon={ThumbsDownIcon} iconSize={19} style={{ paddingInline: "12px" }}>
									<span className="text-sm">450</span>
								</Button>
								<Button variant="transparent" icon={MessageCircle} iconSize={19} style={{ paddingInline: "12px" }}>
									<span className="text-sm">2.5k</span>
								</Button>
								<Button variant="transparent" icon={Share} iconSize={19} style={{ paddingInline: "12px" }}>
									<span className="text-sm">2.5k</span>
								</Button>
							</div>
							<div className="px-2 text-sm">850k views</div>
						</div>
					</div>
				))}
		</div>
	);
};

export default MyPosts;
