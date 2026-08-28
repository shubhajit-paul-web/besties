import { useEffect, useRef } from "react";
import { Paperclip, Send } from "lucide-react";
import Button from "../../../components/ui/Button/Button";
import ChatHeader from "../components/ChatHeader";
import ChatMessage from "../components/ChatMessage";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import fetcher from "@/utils/fetcher";
import { Empty } from "antd";
import useChatMessages from "../hooks/useChatMessages";
import useCurrentUser from "@/hooks/useCurrentUser";
import createConversationKey from "../utils/createConversationKey";
import getConversationMessages from "../utils/getConversationMessages";

const ChatManager = () => {
	const { id: friendId } = useParams();
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const { user: currentUser } = useCurrentUser();
	const { data: friendInfo, isLoading: isLoadingFriendInfo } = useSWR(`/users/${friendId}`, fetcher, { revalidateOnFocus: false });
	const { data: existingMessages, isLoading: isLoadingExistingMessages } = useSWR(`/messages/${friendId}`, fetcher, { shouldRetryOnError: false, revalidateOnFocus: false });

	const friend = friendInfo?.data;

	const { realtimeMessages, handleSendMessage } = useChatMessages(currentUser?._id as string, friendId as string);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [isLoadingExistingMessages, friendId, realtimeMessages]);

	if (isLoadingExistingMessages) {
		return null;
	}

	const conversationKey = createConversationKey(currentUser?._id as string, friendId as string);

	const allChatMessages = getConversationMessages(existingMessages.data, realtimeMessages, conversationKey);

	return (
		<div className="flex h-[calc(100vh-8.4rem)] min-h-136 min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
			<div className="sticky top-0 z-10 shrink-0 border-b border-slate-200/80 bg-white">
				<ChatHeader isLoading={isLoadingFriendInfo} name={friend?.name} avatar={friend?.avatar} />
			</div>
			{/* Chat messages */}
			<div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-100/80 p-3 sm:p-5">
				<div className="flex min-w-0 min-h-full flex-col gap-7">
					{allChatMessages.length === 0 ? (
						<div className="m-auto">
							<Empty description="No messages yet. Start the conversation." />
						</div>
					) : (
						allChatMessages.map((chat, index) => {
							if (chat.sender === friendId || chat.receiver === friendId) {
								return (
									<ChatMessage
										key={chat._id ?? index + chat.createdAt}
										avatar="/profile-img.jpeg"
										isSender={chat.sender === currentUser?._id}
										text={chat.content}
										sentAt={chat.createdAt}
									/>
								);
							}
						})
					)}

					{/* Invisible element at the bottom for auto scroll to bottom */}
					<div ref={messagesEndRef} />
				</div>
			</div>
			{/* Chat controls and input box */}
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
						type="button"
						aria-label="Attach a file"
						title="Attach a file"
						className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
						<Paperclip size={18} />
					</button>
				</form>
			</div>
		</div>
	);
};

export default ChatManager;
