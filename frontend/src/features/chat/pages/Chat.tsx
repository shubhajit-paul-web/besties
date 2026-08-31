import { useEffect, useRef } from "react";
import ChatMessage from "../components/ChatMessage";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import fetcher from "@/utils/fetcher";
import { Empty } from "antd";
import useChatMessages from "../hooks/useChatMessages";
import useCurrentUser from "@/hooks/useCurrentUser";
import createConversationKey from "../utils/createConversationKey";
import getConversationMessages from "../utils/getConversationMessages";
import ChatContainer from "../components/ChatContainer";
import ChatMessagesSkeleton from "../components/ChatMessagesSkeleton";
import type { FriendInfo } from "../types/chat.types";

const ChatManager = () => {
	const { id: friendId } = useParams();
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const { user: currentUser } = useCurrentUser();
	const { data: friendInfo, isLoading: isLoadingFriendInfo } = useSWR(`/users/${friendId}`, fetcher, { revalidateOnFocus: false });
	const { data: existingMessages, isLoading: isLoadingExistingMessages } = useSWR(`/messages/${friendId}`, fetcher, { shouldRetryOnError: false, revalidateOnFocus: false });

	const friend = friendInfo?.data as FriendInfo;

	const { realtimeMessages, handleSendMessage, handleSendMessageWithFile } = useChatMessages(currentUser?._id as string, friendId as string);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [isLoadingExistingMessages, friendId, realtimeMessages]);

	// Skeleton loader
	if (isLoadingExistingMessages) {
		return (
			<ChatContainer friend={friend} isLoadingFriendInfo={isLoadingFriendInfo}>
				<ChatMessagesSkeleton />
			</ChatContainer>
		);
	}

	const conversationKey = createConversationKey(currentUser?._id as string, friendId as string);

	const allChatMessages = getConversationMessages(existingMessages?.data, realtimeMessages, conversationKey);

	return (
		<ChatContainer isLoadingFriendInfo={isLoadingFriendInfo} friend={friend} handleSendMessage={handleSendMessage} handleSendMessageWithFile={handleSendMessageWithFile}>
			{allChatMessages?.length === 0 ? (
				<div className="m-auto">
					<Empty description="No messages yet. Start the conversation." />
				</div>
			) : (
				allChatMessages?.map((chat, index) => {
					if (chat.sender === friendId || chat.receiver === friendId) {
						return (
							<ChatMessage
								key={chat._id ?? chat.clientMessageId ?? `${index}-${chat.createdAt}`}
								avatar="/profile-img.jpeg"
								isSender={chat.sender === currentUser?._id}
								text={chat.content}
								sentAt={chat.createdAt}
								attachment={chat.file}
							/>
						);
					}
				})
			)}

			{/* Invisible element at the bottom for auto scroll to bottom */}
			<div ref={messagesEndRef} />
		</ChatContainer>
	);
};

export default ChatManager;
