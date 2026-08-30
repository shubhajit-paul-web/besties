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

	const { realtimeMessages, handleSendMessage } = useChatMessages(currentUser?._id as string, friendId as string);

	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [isLoadingExistingMessages, friendId, realtimeMessages]);

	// Skeleton loader
	if (isLoadingExistingMessages) {
		return (
			<ChatContainer friend={friend} handleSendMessage={handleSendMessage} isLoadingFriendInfo={isLoadingFriendInfo}>
				<ChatMessagesSkeleton />
			</ChatContainer>
		);
	}

	const conversationKey = createConversationKey(currentUser?._id as string, friendId as string);

	const allChatMessages = getConversationMessages(existingMessages?.data, realtimeMessages, conversationKey);

	return (
		<ChatContainer isLoadingFriendInfo={isLoadingFriendInfo} friend={friend} handleSendMessage={handleSendMessage}>
			{allChatMessages?.length === 0 ? (
				<div className="m-auto">
					<Empty description="No messages yet. Start the conversation." />
				</div>
			) : (
				allChatMessages?.map((chat, index) => {
					if (chat.sender === friendId || chat.receiver === friendId) {
						return (
							<ChatMessage key={chat._id ?? index + chat.createdAt} avatar="/profile-img.jpeg" isSender={chat.sender === currentUser?._id} text={chat.content} sentAt={chat.createdAt} />
						);
					}
				})
			)}

			<ChatMessage
				key="545450"
				avatar="/profile-img.jpeg"
				isSender={true}
				text={"Landscape image"}
				sentAt={"2026-08-29T21:45:39.289Z"}
				attachment={{ path: "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp", type: "image/png" }}
			/>
			<ChatMessage
				key="545450"
				avatar="/profile-img.jpeg"
				isSender={false}
				text={"Landscape image"}
				sentAt={"2026-08-29T21:45:39.289Z"}
				attachment={{ path: "https://tinypng.com/images/social/website.jpg", type: "image/png" }}
			/>
			<ChatMessage
				key="5454504"
				avatar="/profile-img.jpeg"
				isSender={false}
				text={"Landscape image"}
				sentAt={"2026-08-29T21:45:39.289Z"}
				attachment={{ path: "https://videos.pexels.com/video-files/38385092/16300954_2560_1440_30fps.mp4", type: "video/mp4" }}
			/>
			<ChatMessage
				key="5454504"
				avatar="/profile-img.jpeg"
				isSender={false}
				text={"Landscape image"}
				sentAt={"2026-08-29T21:45:39.289Z"}
				attachment={{ path: "https://videos.pexels.com/video-files/38385092/16300954_2560_1440_30fps.mp4", type: "documents/mp4" }}
			/>
			<ChatMessage
				key="5454504"
				avatar="/profile-img.jpeg"
				isSender={true}
				text={"Landscape image"}
				sentAt={"2026-08-29T21:45:39.289Z"}
				attachment={{ path: "https://videos.pexels.com/video-files/38385092/16300954_2560_1440_30fps.mp4", type: "audio/mp4" }}
			/>

			{/* Invisible element at the bottom for auto scroll to bottom */}
			<div ref={messagesEndRef} />
		</ChatContainer>
	);
};

export default ChatManager;
