import { useEffect, useState, type SubmitEvent } from "react";
import socket from "@/lib/socket";
import { generateSignedUrlForFileDownloadApi } from "../apis/chat.api";
import { toast } from "react-toastify";
import createConversationKey from "../utils/createConversationKey";
import { v7 as uuidv7 } from "uuid";
import type { AckResponse, AttachmentData, ChatMessage, ChatMessageWithFile } from "../types/chat.types";

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
		if (!currentUserId || !friendId) return;

		const handleIncomingMessage = (payload: ChatMessage) => {
			setRealtimeMessages((currentMessages) => [...currentMessages, payload]);
		};

		socket.on("message", handleIncomingMessage);

		return () => {
			socket.off("message", handleIncomingMessage);
		};
	}, [currentUserId, friendId]);

	/**
	 * Send an attachment message with optional caption over WebSocket and optimistically update local UI.
	 */
	const handleSendMessageWithFile = async (fileData: ChatMessageWithFile) => {
		if (!currentUserId || !friendId) return;

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
				clientMessageId: uuidv7(),
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

		if (!currentUserId || !friendId) return;

		const form = e.target as HTMLFormElement & {
			message: HTMLInputElement;
		};
		const content = form.message?.value?.trim();

		if (!content || content.length === 0) {
			return;
		}

		const socketPayload = {
			clientMessageId: uuidv7(),
			receiver: friendId,
			content,
		};

		socket.emit("message", socketPayload, handleMessageAck);

		setRealtimeMessages((currentMessages) => [
			...currentMessages,
			{
				...socketPayload,
				sender: currentUserId,
				conversationKey: createConversationKey(currentUserId, friendId),
				createdAt: new Date().toISOString(),
			},
		]);

		form.reset();
	};

	return { realtimeMessages, handleSendMessage, handleSendMessageWithFile };
};

export default useChatMessages;
