import { useEffect, useRef } from "react";
import useSWR from "swr";
import { useParams } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import ChatMessagesSkeleton from "../components/ChatMessagesSkeleton";
import EmptyState from "@/components/ui/EmptyState";
import useChatMessages from "../hooks/useChatMessages";
import useCurrentUser from "@/hooks/useCurrentUser";
import fetcher from "@/utils/fetcher";
import createConversationKey from "../utils/createConversationKey";
import getConversationMessages from "../utils/getConversationMessages";
import type { FriendInfo, MessagesResponse } from "../types/chat.types";
import MessageList from "../components/MessageList";

const ChatManager = () => {
	const { friendId } = useParams<{ friendId: string }>();

	const messageContainerRef = useRef<HTMLDivElement | null>(null);

	const { user: currentUser } = useCurrentUser();

	const { data: friendInfo, isLoading: isLoadingFriendInfo } = useSWR(friendId ? `/users/${friendId}` : null, fetcher, { revalidateOnFocus: false });

	/**
	 * Fetch messages that already exist in the database.
	 *
	 * Realtime messages are handled separately by useChatMessages().
	 */
	const { data: persistedMessages, isLoading: isLoadingPersistedMessages } = useSWR<MessagesResponse>(friendId ? `/messages/${friendId}` : null, fetcher, {
		shouldRetryOnError: false,
		revalidateOnFocus: false,
	});

	const friend = friendInfo?.data as FriendInfo;

	/**
	 * Handles messages received/sent through the realtime connection.
	 */
	const { realtimeMessages, handleSendMessage, handleSendMessageWithFile } = useChatMessages(currentUser?._id as string, friendId as string);

	/**
	 * Scroll to the latest message whenever the conversation
	 * messages change.
	 */
	useEffect(() => {
		if (isLoadingPersistedMessages) return;

		const container = messageContainerRef.current;
		if (!container) return;

		requestAnimationFrame(() => {
			container.scrollTop = container.scrollHeight;
		});
	}, [isLoadingPersistedMessages, persistedMessages, realtimeMessages]);

	if (isLoadingPersistedMessages || !currentUser?._id || !friendId) {
		return (
			<ChatContainer friend={friend} isLoadingFriendInfo={isLoadingFriendInfo}>
				<ChatMessagesSkeleton />
			</ChatContainer>
		);
	}

	const conversationKey = createConversationKey(currentUser._id, friendId);

	/**
	 * Combine database messages with realtime messages
	 * for the currently active conversation.
	 */
	const allChatMessages = getConversationMessages(persistedMessages?.data ?? [], realtimeMessages, conversationKey);

	return (
		<ChatContainer
			friend={friend}
			messageContainerRef={messageContainerRef}
			isLoadingFriendInfo={isLoadingFriendInfo}
			handleSendMessage={handleSendMessage}
			handleSendMessageWithFile={handleSendMessageWithFile}>
			{allChatMessages?.length === 0 ? <EmptyState description="No messages yet. Start the conversation." /> : <MessageList messages={allChatMessages} currentUserId={currentUser._id} />}
		</ChatContainer>
	);
};

export default ChatManager;
