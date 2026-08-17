import Avatar from "../Avatar"

interface ChatMessageInterface {
	author: string
	avatar: string
	text: string
	isOwnMessage: boolean
}

const ChatMessage = ({ author, avatar, text, isOwnMessage }: ChatMessageInterface) => {
	return (
		<div className={`flex items-start gap-3 ${isOwnMessage && "flex-row-reverse justify-start"}`}>
			<Avatar image={avatar} />
			<div className={`${isOwnMessage ? "bg-blue-400/90 text-white" : "bg-white"} p-4 pt-3 w-fit max-w-[60%] rounded-2xl ${isOwnMessage ? "rounded-tr-none" : "rounded-tl-none"}`}>
				<div className={`${isOwnMessage ? "bg-white text-black" : "bg-slate-500 text-white"} font-medium mb-2 w-fit px-3 rounded-2xl text-sm`}>
					{author}
					{isOwnMessage && " (You)"}
				</div>
				<p className="opacity-85">{text}</p>
			</div>
		</div>
	)
}

export default ChatMessage