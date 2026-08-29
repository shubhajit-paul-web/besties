import { FileText, Image as ImageIcon, Upload, X, AlertCircle } from "lucide-react";
import { Modal } from "antd";
import Button from "@/components/ui/Button/Button";
import formatFileSize from "../utils/formatFileSize";
import type { AttachmentPreviewModalProps } from "../types/chat.types";

const AttachmentPreviewModal = ({ open, selectedFile, previewUrl, fileError, onClose, onUpload }: AttachmentPreviewModalProps) => {
	return (
		<Modal
			title="Preview attachment"
			centered
			open={open}
			onCancel={onClose}
			closable
			footer={
				<div className="flex justify-end gap-2">
					<Button type="button" variant="light" icon={X} iconSize={16} onClick={onClose}>
						Cancel
					</Button>
					<Button type="button" variant="indigo" icon={Upload} iconSize={16} onClick={onUpload} disabled={!selectedFile}>
						Upload
					</Button>
				</div>
			}>
			{fileError && (
				<div className="mb-4 flex items-start gap-3 rounded-lg border-2 border-red-500 bg-red-50 p-4 animate-in fade-in duration-300 shadow-md">
					<AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />
					<div>
						<p className="text-sm font-semibold text-red-900">File size exceeds limit</p>
						<p className="mt-1 text-sm text-red-700">{fileError}</p>
					</div>
				</div>
			)}

			{selectedFile && (
				<div className="space-y-4">
					<div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
						{previewUrl ? (
							<img src={previewUrl} alt={`Preview of ${selectedFile.name}`} className="max-h-80 w-full object-contain" />
						) : (
							<div className="flex flex-col items-center gap-3 text-slate-500">
								<FileText size={48} strokeWidth={1.5} />
								<span className="text-sm">Preview unavailable for this file type</span>
							</div>
						)}
					</div>

					<div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
						<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">{previewUrl ? <ImageIcon size={20} /> : <FileText size={20} />}</div>
						<div className="min-w-0">
							<p className="truncate text-sm font-medium text-slate-700">{selectedFile.name}</p>
							<p className="mt-0.5 text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
						</div>
					</div>
				</div>
			)}
		</Modal>
	);
};

export default AttachmentPreviewModal;
