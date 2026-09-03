import { useState } from "react";
import { FileText, Image as ImageIcon, Send, X, AlertCircle, MessageSquare } from "lucide-react";
import { Modal, Input } from "antd";
import Button from "@/components/ui/Button/Button";
import formatFileSize from "../utils/formatFileSize";
import type { AttachmentPreviewModalProps } from "../types/chat.types";

const AttachmentPreviewModal = ({ open, selectedFile, previewUrl, fileError, isUploading, uploadProgress, onClose, onSend }: AttachmentPreviewModalProps) => {
	const [caption, setCaption] = useState("");
	const [prevFile, setPrevFile] = useState<File | null>(selectedFile);

	// Reset caption when a new file is selected or file is cleared
	if (selectedFile !== prevFile) {
		setPrevFile(selectedFile);
		setCaption("");
	}

	const handleSend = () => {
		if (!selectedFile || isUploading || fileError) return;
		onSend(caption);
	};

	return (
		<Modal
			title={
				<div className="flex items-center gap-2 font-semibold text-slate-800">
					<span>Preview attachment</span>
				</div>
			}
			centered
			open={open}
			onCancel={isUploading ? undefined : onClose}
			closable={!isUploading}
			keyboard={!isUploading}
			destroyOnHidden
			footer={
				<div className="flex items-center justify-end gap-2.5 pt-2">
					<Button
						type="button"
						variant="light"
						icon={X}
						iconSize={16}
						onClick={onClose}
						disabled={isUploading}
						className="transition-all hover:bg-slate-200/80 disabled:opacity-50 disabled:cursor-not-allowed">
						Cancel
					</Button>

					<Button
						type="button"
						variant="indigo"
						icon={isUploading ? undefined : Send}
						iconSize={16}
						onClick={handleSend}
						disabled={!selectedFile || isUploading || Boolean(fileError)}
						loader={isUploading}
						loaderText={uploadProgress > 0 ? `Sending (${uploadProgress}%)...` : "Sending..."}
						className="shadow-sm shadow-indigo-200 transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
						<span>Send</span>
					</Button>
				</div>
			}>
			{/* File validation error banner */}
			{fileError && (
				<div className="mb-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50/80 p-3.5 shadow-sm animate-in fade-in duration-300">
					<AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
					<div>
						<p className="text-sm font-semibold text-red-900">File size exceeds limit</p>
						<p className="mt-0.5 text-xs text-red-700 leading-relaxed">{fileError}</p>
					</div>
				</div>
			)}

			{selectedFile && (
				<div className="space-y-3.5 py-1">
					{/* Media Preview Container */}
					<div className="relative flex min-h-60 max-h-85 items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-slate-900/5 backdrop-blur-xs p-2">
						{previewUrl ? (
							<img
								src={previewUrl}
								alt={`Preview of ${selectedFile.name}`}
								className="max-h-75 w-auto max-w-full rounded-lg object-contain shadow-xs transition-transform duration-200 hover:scale-[1.01]"
							/>
						) : (
							<div className="flex flex-col items-center gap-2.5 py-8 text-slate-400">
								<div className="rounded-2xl bg-white p-4 shadow-xs">
									<FileText size={44} className="text-indigo-500" strokeWidth={1.5} />
								</div>
								<span className="text-xs font-medium text-slate-500">Preview unavailable for this file type</span>
							</div>
						)}
					</div>

					{/* File Info Meta Card */}
					<div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 transition-colors">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100/70 text-indigo-600">
							{previewUrl ? <ImageIcon size={20} /> : <FileText size={20} />}
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-medium text-slate-800" title={selectedFile.name}>
								{selectedFile.name}
							</p>
							<p className="mt-0.5 text-xs text-slate-400 font-normal">{formatFileSize(selectedFile.size)}</p>
						</div>
					</div>

					{/* Caption Input Section */}
					<div className="space-y-1.5 pt-0.5">
						<label htmlFor="attachment-caption-input" className="block text-xs font-medium text-slate-600">
							Caption (optional)
						</label>
						<Input
							id="attachment-caption-input"
							placeholder="Add a caption..."
							prefix={<MessageSquare size={16} className="text-slate-400 mr-1" />}
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							onPressEnter={handleSend}
							disabled={isUploading}
							maxLength={200}
							showCount
							allowClear
							autoFocus
							className="rounded-xl border-slate-200 py-2.5! text-sm text-slate-700 transition-all placeholder:text-slate-400 hover:border-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
						/>
					</div>
				</div>
			)}
		</Modal>
	);
};

export default AttachmentPreviewModal;
