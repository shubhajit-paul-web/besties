import { Button, Tooltip } from "antd";
import { FileText, ImagePlus, Trash2, Upload, Video } from "lucide-react";
import type { ChangeEvent } from "react";
import type { AttachmentCategory, AttachmentPickerProps } from "../../types/createPost.types";
import { formatFileSize, MAX_IMAGES, validateFiles } from "../../utils/attachmentValidation";

const AttachmentPicker = ({ attachments, onChange, error, onError }: AttachmentPickerProps) => {
	const category = attachments[0]?.category;

	const selectFiles = (event: ChangeEvent<HTMLInputElement>, selectedCategory: AttachmentCategory) => {
		const files = Array.from(event.target.files ?? []);
		event.target.value = "";
		if (!files.length) return;

		const validationError = validateFiles(files, selectedCategory, attachments);

		if (validationError) {
			onError(validationError);
			return;
		}

		onError(null);

		// Add the selected files as attachments with a unique ID and preview URL.
		const newAttachments = files.map((file) => ({
			id: `${file.name}-${file.lastModified}-${Math.random()}`,
			file,
			category: selectedCategory,
			previewUrl: URL.createObjectURL(file),
		}));

		onChange([...attachments, ...newAttachments]);
	};

	const removeFile = (id: string) => {
		const target = attachments.find((attachment) => attachment.id === id);

		if (target) {
			URL.revokeObjectURL(target.previewUrl);
		}

		onChange(attachments.filter((attachment) => attachment.id !== id));
		onError(null);
	};

	return (
		<div className="space-y-3">
			<div className="flex flex-wrap items-center gap-2">
				<label
					className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 ${(category && category !== "image") || attachments.length >= MAX_IMAGES ? "pointer-events-none opacity-45" : ""}`}>
					<ImagePlus size={16} className="text-emerald-600" /> Images
					<input
						type="file"
						accept="image/*"
						multiple
						hidden
						disabled={Boolean(category && category !== "image") || attachments.length >= MAX_IMAGES}
						onChange={(event) => selectFiles(event, "image")}
					/>
				</label>
				<label
					className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 ${(category && category !== "video") || attachments.length ? "pointer-events-none opacity-45" : ""}`}>
					<Video size={16} className="text-sky-600" /> Video
					<input type="file" accept="video/*" hidden disabled={Boolean(category) || attachments.length > 0} onChange={(event) => selectFiles(event, "video")} />
				</label>
				<label
					className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-rose-300 hover:bg-rose-50 ${(category && category !== "pdf") || attachments.length ? "pointer-events-none opacity-45" : ""}`}>
					<FileText size={16} className="text-rose-600" /> PDF
					<input type="file" accept="application/pdf" hidden disabled={Boolean(category) || attachments.length > 0} onChange={(event) => selectFiles(event, "pdf")} />
				</label>
			</div>
			{error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">{error}</p>}
			{attachments.length > 0 && (
				<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
					{attachments.map((attachment) => (
						<div key={attachment.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
							{attachment.category === "image" ? (
								<img src={attachment.previewUrl} alt={attachment.file.name} className="aspect-square w-full object-cover" />
							) : attachment.category === "video" ? (
								<video src={attachment.previewUrl} controls className="aspect-video w-full object-cover" />
							) : (
								<div className="flex min-h-28 flex-col items-center justify-center gap-2 px-3 text-center">
									<FileText className="text-rose-500" size={28} />
									<span className="line-clamp-2 text-xs font-semibold text-slate-700">{attachment.file.name}</span>
									<span className="text-[11px] text-slate-400">{formatFileSize(attachment.file.size)}</span>
								</div>
							)}
							<Tooltip title="Remove attachment">
								<Button
									type="text"
									shape="circle"
									size="small"
									icon={<Trash2 size={14} />}
									onClick={() => removeFile(attachment.id)}
									className="absolute! right-1.5! top-1.5! bg-white/90! text-slate-600! shadow-sm"
								/>
							</Tooltip>
						</div>
					))}
				</div>
			)}

			{category === "image" && (
				<div className="flex items-center gap-1.5 text-xs text-slate-400">
					<Upload size={13} /> {attachments.length}/{MAX_IMAGES} images selected · max 100 MB total per file
				</div>
			)}
		</div>
	);
};

export default AttachmentPicker;
