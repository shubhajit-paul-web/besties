import { useState } from "react";
import { Popover } from "antd";
import { Check, Earth, LockKeyhole, Users } from "lucide-react";
import type { PostVisibility, PostVisibilitySelectorProps } from "../../types/createPost.types";

const visibilityOptions: { value: PostVisibility; label: string; description: string }[] = [
	{ value: "public", label: "Public", description: "Anyone can see this post" },
	{ value: "friends", label: "Friends", description: "Your friends can see this post" },
	{ value: "private", label: "Only me", description: "Only you can see this post" },
];

const icons = {
	public: Earth,
	friends: Users,
	private: LockKeyhole,
};

const PostVisibilitySelector = ({ value, onChange }: PostVisibilitySelectorProps) => {
	const [open, setOpen] = useState(false);
	const selected = visibilityOptions.find((option) => option.value === value) ?? visibilityOptions[1];
	const SelectedIcon = icons[selected.value];

	const handleSelect = (newValue: PostVisibility) => {
		onChange(newValue);
		setOpen(false);
	};

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
			trigger="click"
			placement="bottomLeft"
			arrow={false}
			content={
				<div className="w-68 space-y-1 p-1">
					<div className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Post audience</div>
					{visibilityOptions.map((option) => {
						const Icon = icons[option.value];
						const isSelected = value === option.value;
						return (
							<button
								key={option.value}
								type="button"
								onClick={() => handleSelect(option.value)}
								className={`flex w-full items-center justify-between rounded-xl p-2.5 text-left transition hover:bg-slate-100 ${
									isSelected ? "bg-slate-50" : ""
								}`}>
								<div className="flex items-center gap-3">
									<span className={`grid size-9 shrink-0 place-items-center rounded-full ${isSelected ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"}`}>
										<Icon size={17} />
									</span>
									<div>
										<strong className="block text-sm font-semibold text-slate-800">{option.label}</strong>
										<span className="text-xs text-slate-500">{option.description}</span>
									</div>
								</div>
								{isSelected && (
									<span className="grid size-5 shrink-0 place-items-center rounded-full bg-blue-600 text-white">
										<Check size={12} strokeWidth={3} />
									</span>
								)}
							</button>
						);
					})}
				</div>
			}>
			<button type="button" className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200">
				<SelectedIcon size={13} /> {selected.label}
			</button>
		</Popover>
	);
};

export default PostVisibilitySelector;
