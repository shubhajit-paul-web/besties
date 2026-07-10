import { useState } from "react";
import Avatar from "./Avatar";
import { Bookmark, EarthIcon, Ellipsis, Heart, LinkIcon, MessageCircle, MessageSquareWarning, Pencil, Pin, Settings, Share, Trash } from "lucide-react";
import IconButton from "./IconButton";
import Button from "./Button";
import utils from "../../utils/index";
import defaultAvatarImage from "../../assets/default-user-avatar.png";

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
	const [showPostActions, setShowPostActions] = useState(false);
	const [showFullCaption, setShowFullCaption] = useState(false);

	// Characters shown before "See more"
	const DEFAULT_CAPTION_LENGTH = 80;

	// Truncates the caption if it's too long and not expanded
	const getDisplayCaption = (caption: string) => {
		if (showFullCaption || caption.length <= DEFAULT_CAPTION_LENGTH) {
			return caption;
		}

		return caption.slice(0, DEFAULT_CAPTION_LENGTH) + "...";
	};

	return (
		<div className="w-150 bg-white border border-slate-200 rounded-xl">
			{/* Post actions overlay */}
			{showPostActions && <div className="w-screen h-screen bg-black/2 fixed top-0 left-0 z-10" onClick={() => setShowPostActions(false)}></div>}

			<div className="p-3">
				{/* Creator and post info */}
				<div className="flex justify-between items-center">
					<Avatar
						image={post.author.avatarUrl}
						imageSize={40}
						imageShape="full"
						title={post.author.name}
						defaultAvatar={defaultAvatarImage}
						subtitle={
							<div className="text-slate-600 flex items-center gap-1 mt-1.5">
								<span>{utils.getPostTime(post.createdAt)}</span>
								<span>&#183;</span>
								<EarthIcon size={13} />
							</div>
						}
					/>

					<div className="relative">
						<IconButton
							variant={showPostActions ? "soft" : "default"}
							icon={Ellipsis}
							onClick={(e) => {
								e.stopPropagation();
								setShowPostActions(!showPostActions);
							}}
							style={{ zIndex: 500 }}
						/>

						{/* Post actions */}
						<div className={`bg-white w-70 p-2 rounded-xl rounded-tr-none border border-slate-300 shadow-2xl absolute right-[50%] top-[80%] z-20 ${showPostActions ? "block" : "hidden"}`}>
							{post.isOwner && (
								<Button variant="transparent" icon={Pin} iconFill="#333" width="100%">
									Pin post
								</Button>
							)}
							<Button variant="transparent" icon={LinkIcon} width="100%">
								Copy link
							</Button>

							<div className="border-b border-b-slate-200 my-2"></div>

							{post.isOwner && (
								<>
									{" "}
									<Button variant="transparent" icon={Pencil} width="100%">
										Edit post
									</Button>
									<Button variant="transparent" icon={Settings} width="100%">
										Edit audience
									</Button>
									<Button variant="transparent" icon={Trash} width="100%">
										Delete post
									</Button>
								</>
							)}

							{post.isOwner && <div className="border-b border-b-slate-200 my-2"></div>}

							<Button variant="redSoft" icon={MessageSquareWarning} width="100%">
								Report post
							</Button>
						</div>
					</div>
				</div>

				{/* Caption */}
				<p className="leading-tight py-2.5 text-slate-800">
					{post.caption && getDisplayCaption(post.caption)}
					{post.caption && post?.caption.length > DEFAULT_CAPTION_LENGTH && (
						<button onClick={() => setShowFullCaption(!showFullCaption)} className="font-medium hover:underline ml-1.5">
							{showFullCaption ? "See less" : "See more"}
						</button>
					)}
				</p>
			</div>

			{post.mediaUrl && (
				<div className="h-160 overflow-hidden bg-slate-900 relative flex justify-center items-center">
					<img
						className="absolute inset-0 h-full w-full object-cover blur-3xl scale-110 opacity-60"
						src={post.mediaUrl}
						draggable="false"
						alt="Post media"
						loading="lazy"
						// onError is here for temporary purpose
						onError={(e) => {
							e.currentTarget.onerror = null; // Prevents infinite loops if defaultImg also fails
							e.currentTarget.src = "https://cdnb.artstation.com/p/assets/images/images/079/205/017/large/sourav-ghosh-back-to-school-x-media-post-template-design-07.jpg?1724262273";
						}}
					/>
					<img
						className="relative z-10 mx-auto max-h-full object-contain"
						src={post.mediaUrl}
						draggable="false"
						alt="Post media"
						loading="lazy"
						// onError is here for temporary purpose
						onError={(e) => {
							e.currentTarget.onerror = null; // Prevents infinite loops if defaultImg also fails
							e.currentTarget.src = "https://cdnb.artstation.com/p/assets/images/images/079/205/017/large/sourav-ghosh-back-to-school-x-media-post-template-design-07.jpg?1724262273";
						}}
					/>
				</div>
			)}

			{/* Post interaction and views count */}
			<div className="p-1.5 opacity-85 flex justify-between items-center">
				<div className="flex items-center">
					<Button variant="transparent" icon={Heart} iconSize={19} style={{ paddingInline: "12px" }} iconFill={post.isLiked && "red"} iconColor={post.isLiked && "red"} title="Like">
						<span className="text-sm">{utils.formatCount(post.metrics.likes)}</span>
					</Button>
					<Button variant="transparent" icon={MessageCircle} iconSize={19} style={{ paddingInline: "12px" }} title="Comment">
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
