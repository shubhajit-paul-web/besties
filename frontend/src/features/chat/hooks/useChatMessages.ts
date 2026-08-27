import socket from "@/lib/socket";
import { useEffect, useState, type SubmitEvent } from "react";
import { toast } from "react-toastify";
import type { AckResponse, ChatMessage } from "../types/chat.types";

const useChatMessages = (currentUserId: string, friendId: string) => {
	const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
	// const { data: existingMessages, isLoading: isLoadingExistingMessages } = useSWR<ChatMessage[]>(`/messages/${friendId}`, fetcher, { shouldRetryOnError: false });

	const handleIncomingMessage = (data: ChatMessage) => {
		console.log("received:", data);

		setRealtimeMessages((currentMessages) => [
			...currentMessages,
			{
				sender: data?.sender,
				content: data?.content,
				createdAt: data?.createdAt,
			},
		]);
	};

	useEffect(() => {
		socket.on("message", handleIncomingMessage);

		return () => {
			socket.off("message", handleIncomingMessage);
		};
	}, []);

	const handleSendMessage = (e: SubmitEvent) => {
		e.preventDefault();

		const form = e.target;
		const content = form.message?.value;

		socket.emit(
			"message",
			{
				receiver: friendId,
				content,
			},
			(response: AckResponse) => {
				if (!response.success) {
					toast.error(response.message || "Faild to send message");
				}
			},
		);

		setRealtimeMessages((currentMessages) => [
			...currentMessages,
			{
				sender: currentUserId,
				content,
				createdAt: new Date().toISOString(),
			},
		]);

		form.reset();
	};

	// const chatMessages = [...existingMessages, ...realtimeMessages];

	return { realtimeMessages, handleSendMessage };
};

export default useChatMessages;
