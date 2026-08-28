import ChatHeader from "./ChatHeader";
import Button from "@/components/ui/Button/Button";
import { Paperclip, Send } from "lucide-react";
import type { ChatContainerProps } from "../types/chat.types";

const ChatContainer = ({ isLoadingFriendInfo, friend, handleSendMessage, children }: ChatContainerProps) => {
	return (
		<div className="flex h-[calc(100vh-8.4rem)] min-h-136 min-w-0 max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-slate-50">
			<div className="sticky top-0 z-10 shrink-0 border-b border-slate-200/80 bg-white">
				<ChatHeader isLoading={isLoadingFriendInfo} name={friend?.name} avatar={friend?.avatar} />
			</div>
			{/* Chat messages */}
			<div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain bg-slate-100/80 p-3 sm:p-5">
				<div className="flex min-w-0 min-h-full flex-col gap-7">{children}</div>
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

export default ChatContainer;
