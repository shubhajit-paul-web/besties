import { useState } from "react";
import Avatar from "./Avatar";
import { Bookmark, EarthIcon, Ellipsis, Heart, MessageCircle, Share } from "lucide-react";
import IconButton from "./IconButton";
import Button from "./Button";
import utils from "../../utils/index";

interface AuthorInterface {
	id: string;
	name: string;
	avatarUrl: string;
}

interface PostMetricsInterface {
	likes: number;
	comments: number;
	shares: number;
}

interface PostInterface {
	id: string;
	author: AuthorInterface;
	createdAt: string;
	caption?: string | undefined;
	mediaUrl?: string | undefined;
	metrics: PostMetricsInterface;

	// User-specific state (contextual to the logged-in viewer)
	isLiked: boolean;
	isSaved: boolean;
	isOwner: boolean;
}

interface PostComponentProps {
	post: PostInterface;
}

const Post = ({ post }: PostComponentProps) => {
	const [showFullCaption, setShowFullCaption] = useState(false);

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
		<div className="w-150 bg-white border border-slate-200 rounded-xl">
			<div className="p-3">
				{/* Creator and post info */}
				<div className="flex justify-between items-center">
					<Avatar
						image={post.author.avatarUrl}
						imageSize={40}
						imageShape="full"
						title={post.author.name}
						subtitle={
							<div className="text-slate-600 flex items-center gap-1 mt-1.5">
								<span>{utils.getPostTime(post.createdAt)}</span>
								<span>&#183;</span>
								<EarthIcon size={13} />
							</div>
						}
					/>

					<IconButton variant="default" icon={Ellipsis} />
				</div>

				{/* Caption */}
				<p className="leading-tight py-2.5 text-slate-800">
					{post.caption && cropCaption(post.caption)}
					{post.caption && post?.caption.length > captionLimit && (
						<button onClick={() => setShowFullCaption(!showFullCaption)} className="font-medium hover:underline ml-1.5">
							{showFullCaption ? "See less" : "See more"}
						</button>
					)}
				</p>
			</div>

			<div className="w-full max-h-160 overflow-hidden">
				<img className="w-full select-none" src={post.mediaUrl} draggable="false" alt="Post media" />
			</div>

			{/* Post interaction and views count */}
			<div className="p-1.5 opacity-85 flex justify-between items-center">
				<div className="flex items-center">
					<Button variant="transparent" icon={Heart} iconSize={19} style={{ paddingInline: "12px" }} iconFill={post.isLiked && "red"} iconColor={post.isLiked && "red"}>
						<span className="text-sm">{utils.formatCount(post.metrics.likes)}</span>
					</Button>
					<Button variant="transparent" icon={MessageCircle} iconSize={19} style={{ paddingInline: "12px" }}>
						<span className="text-sm">{utils.formatCount(post.metrics.comments)}</span>
					</Button>
					<Button variant="transparent" icon={Share} iconSize={19} style={{ paddingInline: "12px" }}>
						<span className="text-sm">{utils.formatCount(post.metrics.shares)}</span>
					</Button>
				</div>
				{/* <div className="px-2 text-sm">850k views</div> */}
				<div>
					<IconButton icon={Bookmark} iconColor={post.isSaved && "black"} iconFill={post.isSaved && "#8a8a8a"} title={post.isSaved ? "Saved" : ""} />
				</div>
			</div>
		</div>
	);
};

export default Post;
