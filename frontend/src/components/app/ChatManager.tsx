import { Paperclip, Send } from "lucide-react"
import Button from "../shared/Button"
import ChatMessage from "../shared/ChatManager/ChatMessage"

const ChatManager = () => {
	return (
		<div>
			{/* Chat messages */}
			<div className="h-[70vh] bg-slate-100 py-3 rounded-2xl">
				<div className="h-full bg-slate-100 rounded-2xl p-5 overflow-y-auto flex flex-col gap-10">
					{Array(10).fill(0).map(() => {
						return <>
							<ChatMessage
								author="Aanya Paul"
								avatar="/public/profile-img.jpeg"
								isOwnMessage={false}
								text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam qui distinctio recusandae quod labore vitae. Necessitatibus, expedita unde dolore repellat harum animi veniam, soluta rerum quae est, quidem perferendis deserunt?"
							/>

							<ChatMessage
								author="Shubhajit Paul"
								avatar="/public/profile-img.jpeg"
								isOwnMessage={true}
								text="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam qui distinctio recusandae quod labore vitae. Necessitatibus..."
							/>
						</>
					})}
				</div>
			</div>
			{/* Chat controls and input box */}
			<div className="bg-slate-100 px-4 py-3 rounded-2xl mt-3 border border-slate-200">
				<form className="flex items-center gap-3">
					<input className="bg-white w-full py-2.5 px-4 rounded-lg border border-slate-200 focus:outline-slate-400" type="text" placeholder="Type your message here..." autoComplete="false" />
					<Button variant="indigo" icon={Send} iconSize={18} className="py-3">Send</Button>
					<button type="button" className="bg-white text-slate-600 border border-slate-300/60 p-3.5 rounded-full cursor-pointer hover:bg-slate-200/70 transition-all">
						<Paperclip size={18} />
					</button>
				</form>
			</div>
		</div>
	)
}

export default ChatManager