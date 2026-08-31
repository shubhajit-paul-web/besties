import { useMemo, createElement } from "react";
import { X, Music } from "lucide-react";
import type { AttachmentLightboxProps } from "../types/chat.types";
import { getAttachmentType, getFileIcon } from "../utils/attachmentUtils";

/**
 * AttachmentLightbox Component
 * Displays attachments in fullscreen modal view
 * - Images: Full-resolution preview
 * - Videos: Fullscreen video player
 * - Audio: Large audio player with file info
 * - Documents: File info card with download button
 */
const AttachmentLightbox = ({ open, attachment, onClose }: AttachmentLightboxProps) => {
	// Calculate before early return to avoid conditional hook calls
	const attachmentType = useMemo(() => (attachment ? getAttachmentType(attachment.fileName, attachment.mimeType, attachment.contentType) : null), [attachment]);

	const IconComponent = useMemo(() => (attachmentType ? getFileIcon(attachmentType) : null), [attachmentType]);

	if (!open || !attachment || !attachmentType) return null;

	// Close on backdrop click (only if clicking the backdrop, not the content)
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	// Close on Escape key
	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Escape") {
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={handleBackdropClick} onKeyDown={handleKeyDown} role="dialog" aria-modal="true">
			{/* Close button */}
			<button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-10 p-2 hover:bg-white/10 rounded-lg" aria-label="Close">
				<X size={28} />
			</button>

			{/* Content container */}
			<div className="max-w-5xl w-full max-h-[90vh] overflow-auto rounded-xl flex items-center justify-center">
				{/* IMAGE PREVIEW - Temporary closed because image preview will be handle by Ant design image component */}
				{/* {attachmentType === "image" && <img src={attachment.path} alt="Fullscreen view" className="max-h-[90vh] max-w-full object-contain rounded-lg shadow-2xl" />} */}

				{/* VIDEO PLAYER */}
				{attachmentType === "video" && <video src={attachment.path} controls autoPlay className="max-h-[90vh] max-w-full rounded-lg shadow-2xl" />}

				{/* AUDIO PLAYER */}
				{attachmentType === "audio" && (
					<div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
						{/* Audio icon */}
						<div className="flex items-center justify-center mb-6">
							<div className="p-4 bg-indigo-100 rounded-full">
								<Music size={48} className="text-indigo-600" />
							</div>
						</div>

						{/* File name */}
						<h3 className="text-center font-semibold text-slate-800 mb-2 truncate text-lg">{attachment.fileName || "Audio file"}</h3>

						{/* Audio player */}
						<audio src={attachment.path} controls autoPlay className="w-full mt-6" />
					</div>
				)}

				{/* DOCUMENT/FILE PREVIEW */}
				{(attachmentType === "document" || attachmentType === "file") && (
					<div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl text-center">
						{/* File icon */}
						<div className="flex items-center justify-center mb-6">
							<div className="p-4 bg-slate-100 rounded-full">
								<div className="text-slate-600">{IconComponent && createElement(IconComponent, { size: 48 })}</div>
							</div>
						</div>

						{/* File name */}
						<h3 className="font-semibold text-slate-800 mb-2 truncate text-lg">{attachment.fileName || "File"}</h3>

						{/* Info text */}
						<p className="text-sm text-slate-500 mb-6">Preview not available for this file type</p>

						{/* Download button */}
						<a
							href={attachment.path}
							download={attachment.fileName}
							className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md hover:shadow-lg">
							{IconComponent && createElement(IconComponent, { size: 20 })}
							Download
						</a>
					</div>
				)}
			</div>
		</div>
	);
};

export default AttachmentLightbox;
