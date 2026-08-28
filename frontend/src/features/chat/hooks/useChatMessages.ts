import socket from "@/lib/socket";
import { useEffect, useState, type SubmitEvent } from "react";
import { toast } from "react-toastify";
import type { AckResponse, ChatMessage } from "../types/chat.types";
import createConversationKey from "../utils/createConversationKey";

const handleMessageAck = (response: AckResponse) => {
	if (!response.success) {
		toast.error(response.message || "Faild to send message");
	}
};

const useChatMessages = (currentUserId: string, friendId: string) => {
	const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);

	const handleIncomingMessage = (payload: ChatMessage) => {
		setRealtimeMessages((currentMessages) => [...currentMessages, payload]);
	};

	useEffect(() => {
		if (currentUserId) {
			socket.on("message", handleIncomingMessage);

			return () => {
				socket.off("message", handleIncomingMessage);
			};
		}
	}, [currentUserId]);

	const handleSendMessage = (e: SubmitEvent) => {
		e.preventDefault();

		const form = e.target;
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

	return { realtimeMessages, handleSendMessage };
};

export default useChatMessages;
