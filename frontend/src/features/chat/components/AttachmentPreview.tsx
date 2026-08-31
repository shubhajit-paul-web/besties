import { useState, useMemo, createElement } from "react";
import { Image as AntImage } from "antd";
import { Camera, AlertCircle, Music, Download, Play } from "lucide-react";
import { getAttachmentType, getFileIcon, formatFileSize } from "../utils/attachmentUtils";
import type { AttachmentPreviewProps } from "../types/chat.types";

/**
 * AttachmentPreview Component
 * Renders different attachment types (image, video, audio, document) with WhatsApp/Facebook-style UI:
 * - Preserves native image/video aspect ratio without hardcoded crop ratios
 * - Constrains width and height boundaries (`max-w-[260px]`, `max-h-[300px]`) for a clean layout
 */
const AttachmentPreview = ({ attachment, caption, isSender, onImageClick }: AttachmentPreviewProps) => {
	const [isLoading, setIsLoading] = useState(true);
	const [hasError, setHasError] = useState(false);

	const attachmentType = useMemo(() => getAttachmentType(attachment.fileName, attachment.mimeType, attachment.contentType), [attachment.fileName, attachment.mimeType, attachment.contentType]);

	const IconComponent = useMemo(() => getFileIcon(attachmentType), [attachmentType]);

	const handleLoad = () => setIsLoading(false);
	const handleError = () => {
		setIsLoading(false);
		setHasError(true);
	};

	const renderCaption = () => {
		if (!caption) return null;
		return <p className={`py-1 px-2 rounded-md text-sm w-fit max-w-xs truncate font-medium ${isSender ? "bg-indigo-400 text-white" : "bg-slate-100 text-slate-700"}`}>{caption}</p>;
	};

	// ============================================================================
	// IMAGE ATTACHMENT RENDER
	// ============================================================================
	if (attachmentType === "image") {
		return (
			<div className="flex flex-col gap-2">
				<div className="relative inline-block overflow-hidden rounded-lg max-w-65 max-h-75">
					{isLoading && (
						<div className="w-56 h-40 bg-slate-200 animate-pulse flex items-center justify-center">
							<Camera size={32} className="text-slate-400" />
						</div>
					)}

					{hasError && !isLoading && (
						<div className="w-56 h-40 bg-slate-100 flex flex-col items-center justify-center gap-2 text-slate-400">
							<AlertCircle size={28} />
							<span className="text-xs">Failed to load image</span>
						</div>
					)}

					{!hasError && (
						<AntImage
							src={attachment.path}
							alt={caption || "attachment"}
							preview={{ mask: "View" }}
							rootClassName="block"
							className={`max-w-65 max-h-75 w-auto h-auto object-cover rounded-lg cursor-pointer transition-transform duration-200 hover:scale-[1.02] ${isLoading ? "hidden" : "block"}`}
							onLoad={handleLoad}
							onError={handleError}
							onClick={onImageClick}
						/>
					)}
				</div>
				{renderCaption()}
			</div>
		);
	}

	// ============================================================================
	// VIDEO ATTACHMENT RENDER
	// ============================================================================
	if (attachmentType === "video") {
		return (
			<div className="flex flex-col gap-2">
				<div className="relative overflow-hidden rounded-lg bg-slate-100 cursor-pointer group max-w-65 max-h-75" onClick={onImageClick} role="button" tabIndex={0}>
					{isLoading && (
						<div className="w-56 h-40 bg-slate-200 animate-pulse flex items-center justify-center">
							<Camera size={32} className="text-slate-400" />
						</div>
					)}

					{hasError && !isLoading && (
						<div className="w-56 h-40 bg-slate-100 flex flex-col items-center justify-center gap-2 text-slate-400">
							<AlertCircle size={28} />
							<span className="text-xs">Video unavailable</span>
						</div>
					)}

					{!hasError && (
						<video src={attachment.path} className={`max-w-65 max-h-75 w-auto h-auto object-cover ${isLoading ? "hidden" : "block"}`} onLoadedMetadata={handleLoad} onError={handleError} />
					)}

					{/* Play button overlay */}
					<div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
						<div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:bg-white transition-colors shadow-lg">
							<Play size={16} className="text-slate-800 ml-0.5" />
						</div>
					</div>
				</div>
				{renderCaption()}
			</div>
		);
	}

	// ============================================================================
	// AUDIO ATTACHMENT RENDER
	// ============================================================================
	if (attachmentType === "audio") {
		return (
			<div className="flex flex-col gap-2">
				{/* Audio file info card */}
				<div className={`rounded-lg p-3 flex items-center gap-3 w-fit max-w-xs ${isSender ? "bg-white/15 border border-white/20" : "bg-slate-100"}`}>
					<div className={`p-2 rounded-lg ${isSender ? "bg-white/20" : "bg-slate-200"}`}>
						<Music size={20} className={isSender ? "text-white" : "text-slate-600"} />
					</div>
					<div className="flex-1 min-w-0">
						<p className={`text-sm font-medium truncate ${isSender ? "text-white" : "text-slate-700"}`}>{attachment.fileName || "Audio file"}</p>
						{attachment.size && <p className={`text-xs ${isSender ? "text-indigo-100" : "text-slate-500"}`}>{formatFileSize(attachment.size)}</p>}
					</div>
				</div>

				{/* Audio player */}
				<audio src={attachment.path} controls className="w-full h-8 rounded-lg" onLoadedMetadata={handleLoad} onError={handleError} />

				{renderCaption()}
			</div>
		);
	}

	// ============================================================================
	// DOCUMENT & FILE ATTACHMENT RENDER
	// ============================================================================
	return (
		<div className="flex flex-col gap-2">
			{/* File download card */}
			<a
				href={attachment.path}
				download={attachment.fileName}
				className={`rounded-lg p-3 flex items-center gap-3 w-fit max-w-xs transition-all duration-200 active:scale-95 ${isSender ? "bg-white/15 border border-white/20" : "bg-slate-100"}`}>
				{/* Icon container */}
				<div className={`p-2 rounded-lg shrink-0 ${isSender ? "bg-white/20" : "bg-slate-200"}`}>
					<div className={isSender ? "text-white" : "text-slate-600"}>{IconComponent && createElement(IconComponent, { size: 20 })}</div>
				</div>

				{/* File info */}
				<div className="flex-1 min-w-0">
					<p className={`text-sm font-medium truncate ${isSender ? "text-white" : "text-slate-700"}`}>{attachment.fileName || `${attachmentType} file`}</p>
					{attachment.size && <p className={`text-xs ${isSender ? "text-indigo-100" : "text-slate-500"}`}>{formatFileSize(attachment.size)}</p>}
				</div>

				{/* Download icon */}
				<Download size={18} className={`shrink-0 ${isSender ? "text-white" : "text-slate-600"}`} />
			</a>

			{renderCaption()}
		</div>
	);
};

export default AttachmentPreview;
