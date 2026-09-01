import socket from "@/lib/socket";
import { useEffect, useState, type SubmitEvent } from "react";
import { toast } from "react-toastify";
import type { AckResponse, AttachmentData, ChatMessage, ChatMessageWithFile } from "../types/chat.types";
import createConversationKey from "../utils/createConversationKey";
import { generateSignedUrlForFileDownloadApi } from "../apis/chat.api";

const handleMessageAck = (response: AckResponse) => {
	if (!response.success) {
		toast.error(response.message || "Failed to send message");
	}
};

/**
 * Custom React hook for managing real-time chat communication via WebSockets.
 * Handles both plain text messages and rich file attachments with captions.
 */
const useChatMessages = (currentUserId: string, friendId: string) => {
	const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);

	useEffect(() => {
		const handleIncomingMessage = (payload: ChatMessage) => {
			setRealtimeMessages((currentMessages) => [...currentMessages, payload]);
		};

		if (currentUserId) {
			socket.on("message", handleIncomingMessage);

			return () => {
				socket.off("message", handleIncomingMessage);
			};
		}
	}, [currentUserId]);

	/**
	 * Send an attachment message with optional caption over WebSocket and optimistically update local UI.
	 */
	const handleSendMessageWithFile = async (fileData: ChatMessageWithFile) => {
		const conversationKey = createConversationKey(currentUserId, friendId);

		const file: AttachmentData = {
			path: fileData.path,
			contentType: fileData.contentType,
			fileName: fileData.fileName || undefined,
			size: fileData.size,
		};

		socket.emit(
			"message",
			{
				receiver: friendId,
				content: fileData.caption,
				file,
			},
			handleMessageAck,
		);

		const downloadFileResponse = await generateSignedUrlForFileDownloadApi(file.path).catch(() => null);

		setRealtimeMessages((currentMessages) => [
			...currentMessages,
			{
				clientMessageId: crypto.randomUUID(),
				conversationKey,
				sender: currentUserId,
				receiver: friendId,
				content: fileData.caption,
				file: {
					...file,
					path: downloadFileResponse?.data?.url || null,
				},
				createdAt: new Date().toISOString(),
			},
		]);
	};

	/**
	 * Send a standard text message over WebSocket and optimistically update local UI.
	 */
	const handleSendMessage = (e: SubmitEvent) => {
		e.preventDefault();

		const form = e.target as HTMLFormElement & {
			message: HTMLInputElement;
		};
		const content = form.message?.value?.trim();

		if (!content || content.length === 0) {
			return;
		}

		socket.emit(
			"message",
			{
				receiver: friendId,
				content,
			},
			handleMessageAck,
		);

		const conversationKey = createConversationKey(currentUserId, friendId);

		setRealtimeMessages((currentMessages) => [
			...currentMessages,
			{
				clientMessageId: crypto.randomUUID(),
				conversationKey,
				sender: currentUserId,
				receiver: friendId,
				content,
				createdAt: new Date().toISOString(),
			},
		]);

		form.reset();
	};

	return { realtimeMessages, handleSendMessage, handleSendMessageWithFile };
};

export default useChatMessages;
