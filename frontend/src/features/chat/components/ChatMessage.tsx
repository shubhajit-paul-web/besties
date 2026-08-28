import Avatar from "../../../components/ui/Avatar";
import type { ChatMessageProps } from "../types/chat.types";
import moment from "moment";

const ChatMessage = ({ avatar, text, isSender, sentAt }: ChatMessageProps) => {
	sentAt = moment(sentAt).format("hh:mm A");

	return (
		<div className={`flex items-end gap-3 ${isSender ? "flex-row-reverse" : ""}`}>
			<Avatar image={avatar} imageSize={34} className="shrink-0" />
			<div
				className={`w-fit max-w-[min(75%,38rem)] px-4 py-3 text-sm leading-6 shadow-sm ${
					isSender ? "rounded-2xl rounded-br-md bg-indigo-600 text-white" : "rounded-2xl rounded-bl-md border border-slate-200/80 bg-white text-slate-700"
				}`}>
				<p>{text}</p>
				<p className={`mt-1 opacity-70 text-xs ${isSender && "text-right"}`}>{sentAt}</p>
			</div>
		</div>
	);
};

export default ChatMessage;
