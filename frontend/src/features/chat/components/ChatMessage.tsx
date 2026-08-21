import Avatar from "../../../components/ui/Avatar";
import type { ChatMessageInterface } from "../types/chat.types";

const ChatMessage = ({ avatar, text, isOwnMessage }: ChatMessageInterface) => {
	return (
		<div className={`flex items-end gap-3 ${isOwnMessage ? "flex-row-reverse" : ""}`}>
			<Avatar image={avatar} imageSize={34} className="shrink-0" />
			<div
				className={`w-fit max-w-[min(75%,38rem)] px-4 py-3 text-sm leading-6 shadow-sm ${
					isOwnMessage ? "rounded-2xl rounded-br-md bg-indigo-600 text-white" : "rounded-2xl rounded-bl-md border border-slate-200/80 bg-white text-slate-700"
				}`}>
				<p>{text}</p>
			</div>
		</div>
	);
};

export default ChatMessage;
