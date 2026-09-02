import type { MessageListProps } from "../types/chat.types";
import ChatMessage from "./ChatMessage";

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
	return messages?.map((chat) => (
		<ChatMessage key={chat.clientMessageId ?? chat._id} avatar="/profile-img.jpeg" isSender={chat.sender === currentUserId} text={chat.content} sentAt={chat.createdAt} attachment={chat.file} />
	));
};

export default MessageList;
