import { Popover } from "antd";
import { Earth, LockKeyhole, Users } from "lucide-react";
import type { PostVisibility, PostVisibilitySelectorProps } from "../../types/createPost.types";

const visibilityOptions: { value: PostVisibility; label: string; description: string }[] = [
	{ value: "public", label: "Public", description: "Anyone can see this post" },
	{ value: "friends", label: "Friends", description: "Your friends can see this post" },
	{ value: "only-me", label: "Only me", description: "Only you can see this post" },
];

const icons = {
	public: Earth,
	friends: Users,
	"only-me": LockKeyhole,
};

const PostVisibilitySelector = ({ value, onChange }: PostVisibilitySelectorProps) => {
	const selected = visibilityOptions.find((option) => option.value === value) ?? visibilityOptions[1];
	const SelectedIcon = icons[selected.value];

	return (
		<Popover
			trigger="click"
			placement="bottomLeft"
			content={
				<div className="w-64 space-y-1">
					<div className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Post audience</div>
					{visibilityOptions.map((option) => {
						const Icon = icons[option.value];
						return (
							<button
								key={option.value}
								type="button"
								onClick={() => onChange(option.value)}
								className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition hover:bg-slate-100 ${value === option.value ? "bg-slate-50" : ""}`}>
								<span className="grid size-9 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600">
									<Icon size={17} />
								</span>
								<span>
									<strong className="block text-sm text-slate-800">{option.label}</strong>
									<span className="text-xs text-slate-500">{option.description}</span>
								</span>
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
