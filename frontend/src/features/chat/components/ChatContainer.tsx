import { useEffect, useRef, useState, type ChangeEvent } from "react";
import ChatHeader from "./ChatHeader";
import AttachmentPreviewModal from "./AttachmentPreviewModal";
import Button from "@/components/ui/Button/Button";
import { Paperclip, Send, AlertCircle } from "lucide-react";
import type { ChatContainerProps } from "../types/chat.types";
import { message } from "antd";

// File size validation constants
const MAX_FILE_SIZE_MB = 100;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// Validate file size and return error message if invalid
const validateFileSize = (file: File): string | null => {
	if (!file) return null;

	if (file.size > MAX_FILE_SIZE_BYTES) {
		const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
		return `File size (${fileSizeInMB}MB) exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB. Please choose a smaller file.`;
	}

	return null;
};

const ChatContainer = ({ isLoadingFriendInfo, friend, handleSendMessage, children }: ChatContainerProps) => {
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [modalOpen, setModalOpen] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState("");
	const [fileError, setFileError] = useState<string | null>(null);

	// Clear file input value (resets the input element state)
	const resetFileInput = () => {
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	useEffect(() => {
		// Release the temporary preview URL when it is no longer needed
		return () => {
			if (previewUrl) URL.revokeObjectURL(previewUrl);
		};
	}, [previewUrl]);

	const handleAttachmentChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];

		// Clear previous error state
		setFileError(null);

		if (!file) {
			resetFileInput();
			return;
		}

		// Validate file size
		const error = validateFileSize(file);

		if (error) {
			setFileError(error);
			resetFileInput();

			// Show prominent error notification
			message.error({
				content: error,
				duration: 6,
				className: "!bg-red-50 !border-2 !border-red-500 !text-red-700 !font-semibold !text-base !py-4",
				icon: <AlertCircle className="text-red-600" size={22} />,
				style: {
					boxShadow: "0 10px 25px rgba(239, 68, 68, 0.2)",
				},
			});

			return;
		}

		// File is valid, proceed with preview
		setSelectedFile(file);
		setPreviewUrl(file.type.startsWith("image/") ? URL.createObjectURL(file) : "");
		setModalOpen(true);
	};

	const closeAttachmentModal = () => {
		setModalOpen(false);
		setSelectedFile(null);
		setPreviewUrl("");
		setFileError(null);
		resetFileInput();
	};

	const handleUpload = () => {
		if (!selectedFile) return;

		// Clear error state on successful upload
		setFileError(null);
		closeAttachmentModal();
	};

	const handleAttachmentClick = () => {
		const fileInput = fileInputRef?.current;

		if (!fileInput) return;

		fileInput.click();
	};

	return (
		<>
			<AttachmentPreviewModal open={modalOpen} selectedFile={selectedFile} previewUrl={previewUrl} fileError={fileError} onClose={closeAttachmentModal} onUpload={handleUpload} />

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
