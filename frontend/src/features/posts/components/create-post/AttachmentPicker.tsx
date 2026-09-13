import { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import { ChevronLeft, ChevronRight, FileText, ImagePlus, Upload, Video, X } from "lucide-react";
import type { ChangeEvent } from "react";
import type { AttachmentCategory, AttachmentPickerProps } from "../../types/post.types";
import { formatFileSize, MAX_IMAGES, validateFiles } from "../../utils/attachmentValidation";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";

const AttachmentPicker = ({ attachments, onChange, error, onError }: AttachmentPickerProps) => {
	const category = attachments[0]?.category;
	const swiperRef = useRef<SwiperClass | null>(null);
	const [isBeginning, setIsBeginning] = useState(true);
	const [isEnd, setIsEnd] = useState(false);

	const updateSlideState = (swiper: SwiperClass) => {
		setIsBeginning(swiper.isBeginning);
		setIsEnd(swiper.isEnd);
	};

	// Keep swiper updated when items are added or removed
	useEffect(() => {
		if (swiperRef.current) {
			swiperRef.current.update();
			setIsBeginning(swiperRef.current.isBeginning);
			setIsEnd(swiperRef.current.isEnd);
		}
	}, [attachments.length]);

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
			{/* Category selectors */}
			<div className="flex flex-wrap items-center gap-2">
				<label
					className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/90 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50/70 active:scale-98 ${
						(category && category !== "image") || attachments.length >= MAX_IMAGES ? "pointer-events-none opacity-45" : ""
					}`}>
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
					className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/90 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:bg-sky-50/70 active:scale-98 ${
						(category && category !== "video") || attachments.length ? "pointer-events-none opacity-45" : ""
					}`}>
					<Video size={16} className="text-sky-600" /> Video
					<input type="file" accept="video/*" hidden disabled={Boolean(category) || attachments.length > 0} onChange={(event) => selectFiles(event, "video")} />
				</label>
				<label
					className={`inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/90 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:border-rose-300 hover:bg-rose-50/70 active:scale-98 ${
						(category && category !== "pdf") || attachments.length ? "pointer-events-none opacity-45" : ""
					}`}>
					<FileText size={16} className="text-rose-600" /> PDF
					<input type="file" accept="application/pdf" hidden disabled={Boolean(category) || attachments.length > 0} onChange={(event) => selectFiles(event, "pdf")} />
				</label>
			</div>

			{/* Inline Error */}
			{error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-600">{error}</p>}

			{/* Attachment Previews */}
			{attachments.length > 0 && (
				<div className="relative">
					{/* Video Attachment Preview */}
					{category === "video" && (
						<div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-slate-950">
							<video src={attachments[0].previewUrl} controls className="aspect-video max-h-56 w-full object-contain" />
							<Tooltip title="Remove video">
								<button
									type="button"
									onClick={() => removeFile(attachments[0].id)}
									className="absolute top-2 right-2 z-10 flex size-7 items-center justify-center rounded-full bg-black/60 text-white/90 backdrop-blur-xs transition hover:bg-rose-600 hover:text-white cursor-pointer shadow-sm"
									aria-label="Remove video">
									<X size={14} strokeWidth={2.5} />
								</button>
							</Tooltip>
						</div>
					)}

					{/* PDF Attachment Preview */}
					{category === "pdf" && (
						<div className="relative flex items-center gap-3 rounded-xl border border-slate-200/90 bg-rose-50/40 p-3.5 transition">
							<div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
								<FileText size={22} />
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-semibold text-slate-800">{attachments[0].file.name}</p>
								<p className="text-xs text-slate-400 font-medium">PDF · {formatFileSize(attachments[0].file.size)}</p>
							</div>
							<Tooltip title="Remove PDF">
								<button
									type="button"
									onClick={() => removeFile(attachments[0].id)}
									className="flex size-7 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition cursor-pointer"
									aria-label="Remove PDF">
									<X size={15} strokeWidth={2.5} />
								</button>
							</Tooltip>
						</div>
					)}

					{/* Image Attachments Carousel with Swiper JS */}
					{category === "image" && (
						<div className="relative group/carousel">
							<Swiper
								onSwiper={(swiper) => {
									swiperRef.current = swiper;
									updateSlideState(swiper);
								}}
								onSlideChange={updateSlideState}
								grabCursor={true}
								spaceBetween={10}
								slidesPerView={attachments.length === 1 ? 1 : attachments.length === 2 ? 2 : 3}
								breakpoints={{
									0: {
										slidesPerView: attachments.length === 1 ? 1 : Math.min(attachments.length, 2.2),
										spaceBetween: 8,
									},
									480: {
										slidesPerView: attachments.length === 1 ? 1 : attachments.length === 2 ? 2 : 3,
										spaceBetween: 10,
									},
								}}
								className="attachment-swiper rounded-xl">
								{attachments.map((attachment, index) => (
									<SwiperSlide key={attachment.id}>
										<div
											className={`group relative w-full overflow-hidden rounded-xl border border-slate-200/90 bg-slate-100 shadow-2xs ${
												attachments.length === 1 ? "aspect-video max-h-56 sm:aspect-16/10" : "aspect-square"
											}`}>
											<img
												src={attachment.previewUrl}
												alt={attachment.file.name}
												className="h-full w-full object-cover select-none transition-transform duration-300 group-hover:scale-105 pointer-events-none"
												draggable={false}
											/>

											{/* Image sequence badge (#1, #2, ...) */}
											{attachments.length > 1 && (
												<span className="absolute top-2 left-2 z-10 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs shadow-xs pointer-events-none select-none">
													{index + 1}
												</span>
											)}

											{/* Remove photo button */}
											<Tooltip title="Remove photo">
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														removeFile(attachment.id);
													}}
													className="absolute top-2 right-2 z-10 flex size-6.5 items-center justify-center rounded-full bg-black/60 text-white/95 backdrop-blur-xs transition hover:bg-rose-600 hover:scale-110 active:scale-95 shadow-sm cursor-pointer"
													aria-label="Remove photo">
													<X size={13} strokeWidth={2.5} />
												</button>
											</Tooltip>
										</div>
									</SwiperSlide>
								))}
							</Swiper>

							{/* Custom Navigation buttons (shown when there are more than 3 slides) */}
							{attachments.length > 3 && (
								<>
									<button
										type="button"
										onClick={() => swiperRef.current?.slidePrev()}
										disabled={isBeginning}
										className={`absolute -left-2.5 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:text-blue-600 hover:scale-105 active:scale-95 cursor-pointer ${
											isBeginning ? "opacity-0 pointer-events-none" : "opacity-100"
										}`}
										aria-label="Previous images">
										<ChevronLeft size={18} strokeWidth={2.5} />
									</button>
									<button
										type="button"
										onClick={() => swiperRef.current?.slideNext()}
										disabled={isEnd}
										className={`absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 flex size-8 items-center justify-center rounded-full border border-slate-200/90 bg-white/95 text-slate-700 shadow-md backdrop-blur-xs transition-all hover:bg-white hover:text-blue-600 hover:scale-105 active:scale-95 cursor-pointer ${
											isEnd ? "opacity-0 pointer-events-none" : "opacity-100"
										}`}
										aria-label="Next images">
										<ChevronRight size={18} strokeWidth={2.5} />
									</button>
								</>
							)}
						</div>
					)}
				</div>
			)}

			{/* Image counter and summary */}
			{category === "image" && (
				<div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
					<div className="flex items-center gap-1.5 font-medium">
						<Upload size={13} className="text-slate-400" />
						<span>
							<strong className="text-slate-700">{attachments.length}</strong>/{MAX_IMAGES} images selected
						</span>
						<span className="text-slate-300">·</span>
						<span className="text-slate-400">max 100 MB total</span>
					</div>
					{attachments.length > 3 && <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Swipe to view all</span>}
				</div>
			)}
		</div>
	);
};

export default AttachmentPicker;
