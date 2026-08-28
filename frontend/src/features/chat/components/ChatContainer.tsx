import { useEffect, useRef, useState, type ChangeEvent } from "react";
import ChatHeader from "./ChatHeader";
import Button from "@/components/ui/Button/Button";
import { FileText, Image as ImageIcon, Paperclip, Send, Upload, X } from "lucide-react";
import type { ChatContainerProps } from "../types/chat.types";
import formatFileSize from "../utils/formatFileSize";
import { Modal } from "antd";

const ChatContainer = ({ isLoadingFriendInfo, friend, handleSendMessage, children }: ChatContainerProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState("");

	useEffect(() => {
		// Release the temporary preview URL when it is no longer needed
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setSelectedFile(file);
		setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : "");
		setModalOpen(true);
	};

	const closeAttachmentModal = () => {
		setModalOpen(false);
		setSelectedFile(null);
		setPreviewUrl("");

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleUpload = () => {
		if (!selectedFile) return;

		closeAttachmentModal();
	};

	const handleAttachmentClick = () => {
		const fileInput = fileInputRef?.current;

		if (!fileInput) return;

		fileInput.click();
	};

	return (
		<>
			<Modal
				title="Preview attachment"
				centered
				open={modalOpen}
				onCancel={closeAttachmentModal}
				closable
				footer={
					<div className="flex justify-end gap-2">
						<Button type="button" variant="light" icon={X} iconSize={16} onClick={closeAttachmentModal}>
							Cancel
						</Button>
						<Button type="button" variant="indigo" icon={Upload} iconSize={16} onClick={handleUpload} disabled={!selectedFile}>
							Upload
						</Button>
					</div>
				}>
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
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
								{previewUrl ? <ImageIcon size={20} /> : <FileText size={20} />}
							</div>
							<div className="min-w-0">
								<p className="truncate text-sm font-medium text-slate-700">{selectedFile.name}</p>
								<p className="mt-0.5 text-xs text-slate-400">{formatFileSize(selectedFile.size)}</p>
							</div>
						</div>
					</div>
				)}
			</Modal>

			<div className="flex h-[calc(100vh-8.4rem)] min-h-136 min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
				<div className="sticky top-0 z-10 shrink-0 border-b border-slate-200/80 bg-white">
					<ChatHeader isLoading={isLoadingFriendInfo} name={friend?.name} avatar={friend?.avatar} />
				</div>
				{/* Scrollable message history */}
				<div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-100/80 p-3 sm:p-5">
					<div className="flex min-w-0 min-h-full flex-col gap-7">{children}</div>
				</div>
				{/* Message composer and file attachment controls */}
				<div className="shrink-0 border-t border-slate-200/80 bg-white p-3 sm:p-4">
					<form onSubmit={handleSendMessage} className="flex items-center gap-2 sm:gap-3">
						<input
							className="min-w-0 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
							type="text"
							placeholder="Type your message here..."
							autoComplete="off"
							name="message"
							autoFocus
						/>
						<Button type="submit" variant="indigo" icon={Send} iconSize={18} className="shrink-0 rounded-xl px-3 py-3 sm:px-4" aria-label="Send message">
							<span className="hidden sm:inline">Send</span>
						</Button>
						<button
							onClick={handleAttachmentClick}
							type="button"
							aria-label="Attach a file"
							title="Attach a file"
							className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
							<Paperclip size={18} />
						</button>

						<input ref={fileInputRef} onChange={handleAttachmentChange} className="hidden" type="file" name="attachment" />
					</form>
				</div>
			</div>
		</>
	);
};

export default ChatContainer;
