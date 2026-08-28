import { Skeleton } from "antd";

const skeletonMessages = [
	{ isSender: false, width: "min(72%, 28rem)", lines: 2 },
	{ isSender: true, width: "min(42%, 16rem)", lines: 1 },
	{ isSender: false, width: "min(58%, 23rem)", lines: 1 },
	{ isSender: true, width: "min(34%, 13rem)", lines: 2 },
];

const ChatMessagesSkeleton = () => {
	return (
		<div className="flex min-h-full flex-col justify-end gap-7" aria-label="Loading conversation" aria-busy="true">
			{skeletonMessages.map(({ isSender, width, lines }, index) => (
				<div key={index} className={`flex items-end gap-3 ${isSender ? "flex-row-reverse" : ""}`}>
					<Skeleton.Avatar active size={34} shape="circle" />
					<div
						className={`flex max-w-[75%] flex-col gap-2 rounded-2xl border px-4 py-3 shadow-sm ${
							isSender ? "rounded-br-md border-indigo-600 bg-indigo-600" : "rounded-bl-md border-slate-200/80 bg-white"
						}`}
						style={{ width }}>
						{Array.from({ length: lines }).map((_, lineIndex) => (
							<Skeleton.Input key={lineIndex} active size="small" block />
						))}
						<Skeleton.Input active size="small" style={{ width: "4.5rem" }} />
					</div>
				</div>
			))}
		</div>
	);
};

export default ChatMessagesSkeleton;
