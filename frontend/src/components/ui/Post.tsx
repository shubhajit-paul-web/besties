import { useRef, useState } from "react";
import Avatar from "./Avatar";
import { ArrowLeft, ArrowRight, Bookmark, EarthIcon, Ellipsis, Heart, LinkIcon, MessageCircle, MessageSquareWarning, Pencil, Pin, Settings, Share, Trash, Users } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import IconButton from "./Button/IconButton";
import Button from "./Button/Button";
import utils from "../../utils/index";
import defaultAvatarImage from "../../assets/images/default-user-avatar.png";
import type { PostComponentProps } from "../../types/post.types";
import formatUserName from "@/utils/formatUserName";
import formatCount from "@/utils/formatCount";

const Post = ({ post, currentUserId }: PostComponentProps) => {
	const swiperRef = useRef<SwiperClass | null>(null);
	const [showPostActions, setShowPostActions] = useState(false);
	const [showFullCaption, setShowFullCaption] = useState(false);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);

	const isPostOwner = currentUserId === post.user?._id;

	// Keep only real media links so broken or empty files do not render.
	const validFiles = (post.files ?? []).filter((file) => Boolean(file?.path && file.path.trim()));

	// Show only a short preview of the caption before the user chooses to expand it.
	const DEFAULT_CAPTION_LENGTH = 80;

	// Show the full caption if the user expands it, otherwise show a shortened version.
	const getDisplayCaption = (caption: string) => {
		if (showFullCaption || caption.length <= DEFAULT_CAPTION_LENGTH) {
			return caption;
		}

		return caption.slice(0, DEFAULT_CAPTION_LENGTH) + "...";
	};

	// Keep track of whether the user is at the first or last image in the carousel.
	const updateSlideState = (swiper: SwiperClass) => {
		setIsBeginning(swiper.isBeginning);
		setIsEnd(swiper.isEnd);
	};

	// Render one media item for the swiper. If the image fails, show a fallback image.
	const renderMedia = (filePath: string | null, index: number) => {
		const hasValidUrl = Boolean(filePath && filePath.trim());

		if (!hasValidUrl) {
			return null;
		}

		const validFilePath = filePath?.trim() ? filePath : undefined;

		return (
			<SwiperSlide key={`media-${filePath}-${index}`}>
				<div className="relative h-64 w-full overflow-hidden rounded-xl bg-slate-900 sm:h-80 md:h-96 lg:h-112">
					<img
						className="absolute inset-0 h-full w-full scale-110 object-cover opacity-60 blur-3xl select-none"
						src={validFilePath}
						draggable="false"
						alt="Post media"
						loading="lazy"
						// onError={(e) => {
						// 	e.currentTarget.onerror = null;
						// 	e.currentTarget.src = "https://cdnb.artstation.com/p/assets/images/images/079/205/017/large/sourav-ghosh-back-to-school-x-media-post-template-design-07.jpg?1724262273";
						// }}
					/>
					<img
						className="relative z-10 mx-auto h-full w-full object-contain"
						src={validFilePath}
						draggable="false"
						alt="Post media"
						loading="lazy"
						// onError={(e) => {
						// 	e.currentTarget.onerror = null;
						// 	e.currentTarget.src = "https://cdnb.artstation.com/p/assets/images/images/079/205/017/large/sourav-ghosh-back-to-school-x-media-post-template-design-07.jpg?1724262273";
						// }}
					/>
				</div>
			</SwiperSlide>
		);
	};

	return (
		<div className="w-full max-w-150 bg-white border border-slate-200 rounded-xl">
			{/* Close the post menu when the user taps outside it. */}
			{showPostActions && <div className="w-screen h-screen bg-black/2 fixed top-0 left-0 z-10" onClick={() => setShowPostActions(false)}></div>}

			<div className="p-3">
				{/* Top section: author info, time, and post menu button. */}
				<div className="flex justify-between items-center">
					<Avatar
						image={post.user?.avatar || "/profile-img.jpeg"}
						imageSize={40}
						imageShape="full"
						title={formatUserName(post.user?.name)}
						defaultAvatar={defaultAvatarImage}
						subtitle={
							<div className="text-slate-600 flex items-center gap-1 mt-1.5">
								<span>{utils.getPostTime(post.createdAt)}</span>
								<span>&#183;</span>
								{post.visibility === "public" ? <EarthIcon size={13} /> : <Users size={13} />}
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
						<div
							className={`bg-white w-64 sm:w-70 p-2 rounded-xl rounded-tr-none border border-slate-300 shadow-2xl absolute right-[50%] top-[80%] z-999 ${showPostActions ? "block" : "hidden"}`}>
							{isPostOwner && (
								<Button variant="transparent" icon={Pin} iconFill="#333" width="100%">
									Pin post
								</Button>
							)}
							<Button variant="transparent" icon={LinkIcon} width="100%">
								Copy link
							</Button>

							<div className="border-b border-b-slate-200 my-2"></div>

							{isPostOwner && (
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

							{isPostOwner && <div className="border-b border-b-slate-200 my-2"></div>}

							<Button variant="redSoft" icon={MessageSquareWarning} width="100%">
								Report post
							</Button>
						</div>
					</div>
				</div>

				{/* Caption area with the option to expand or collapse long text. */}
				<p className="leading-tight py-2.5 text-slate-800">
					{post.content && getDisplayCaption(post.content)}
					{post.content && post?.content.length > DEFAULT_CAPTION_LENGTH && (
						<button onClick={() => setShowFullCaption(!showFullCaption)} className="font-medium hover:underline ml-1.5">
							{showFullCaption ? "See less" : "See more"}
						</button>
					)}
				</p>
			</div>

			{validFiles.length > 0 && (
				<div className="relative w-full overflow-hidden bg-white px-2 pb-2 pt-1">
					{/* Show the post media in a carousel when more than one image is attached. */}
					<Swiper
						onSwiper={(swiper) => {
							swiperRef.current = swiper;
							updateSlideState(swiper);
						}}
						onSlideChange={(swiper) => updateSlideState(swiper)}
						spaceBetween={12}
						slidesPerView={1}
						grabCursor
						breakpoints={{
							0: { slidesPerView: 1 },
							640: { slidesPerView: 1 },
						}}
						className="post-media-swiper w-full">
						{validFiles.map((file, index) => renderMedia(file?.path ?? null, index))}
					</Swiper>

					{validFiles.length > 1 && (
						<>
							<button
								type="button"
								onClick={() => swiperRef.current?.slidePrev()}
								disabled={isBeginning}
								className={`absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all ${
									isBeginning ? "pointer-events-none opacity-0" : "opacity-100 hover:bg-white hover:text-slate-900"
								}`}
								aria-label="Previous image">
								<ArrowLeft size={16} strokeWidth={2.5} />
							</button>
							<button
								type="button"
								onClick={() => swiperRef.current?.slideNext()}
								disabled={isEnd}
								className={`absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-md backdrop-blur-sm transition-all ${
									isEnd ? "pointer-events-none opacity-0" : "opacity-100 hover:bg-white hover:text-slate-900"
								}`}
								aria-label="Next image">
								<ArrowRight size={16} strokeWidth={2.5} />
							</button>
						</>
					)}
				</div>
			)}

			{/* Bottom action row: likes, comments, shares, and save status. */}
			<div className="p-1.5 opacity-85 flex justify-between items-center">
				<div className="flex items-center">
					<Button variant="transparent" icon={Heart} iconSize={19} style={{ paddingInline: "12px" }} iconFill={post.isLiked && "red"} iconColor={post.isLiked && "red"} title="Like">
						<span className="text-sm">{formatCount(post.metrics?.likes || 0)}</span>
					</Button>
					<Button variant="transparent" icon={MessageCircle} iconSize={19} style={{ paddingInline: "12px" }} title="Comment">
						<span className="text-sm">{formatCount(post.metrics?.comments || 0)}</span>
					</Button>
					<Button variant="transparent" icon={Share} iconSize={19} style={{ paddingInline: "12px" }}>
						<span className="text-sm">{formatCount(post.metrics?.shares || 0)}</span>
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
