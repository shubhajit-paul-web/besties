import { Popover } from "antd";
import { Heart, Meh, PartyPopper, Smile, Sparkles, Utensils, type LucideIcon } from "lucide-react";
import type { FeelingActivityPickerProps } from "../../types/createPost.types";

const options: { label: string; icon: string; component: LucideIcon }[] = [
	{ label: "Happy", icon: "😊", component: Smile },
	{ label: "Excited", icon: "✨", component: Sparkles },
	{ label: "Sad", icon: "😔", component: Meh },
	{ label: "Lonely", icon: "🌙", component: Meh },
	{ label: "Loved", icon: "💗", component: Heart },
	{ label: "Grateful", icon: "🙏", component: Heart },
	{ label: "Proud", icon: "🌟", component: Sparkles },
	{ label: "Relaxed", icon: "😌", component: Smile },
	{ label: "Motivated", icon: "💪", component: Sparkles },
	{ label: "Blessed", icon: "🌿", component: Sparkles },
	{ label: "Tired", icon: "😴", component: Meh },
	{ label: "Angry", icon: "😤", component: Meh },
	{ label: "Celebrating", icon: "🎉", component: PartyPopper },
	{ label: "Watching", icon: "📺", component: Smile },
	{ label: "Listening", icon: "🎧", component: Smile },
	{ label: "Traveling", icon: "✈️", component: Sparkles },
	{ label: "Eating", icon: "🍜", component: Utensils },
];

const FeelingActivityPicker = ({ value, onChange }: FeelingActivityPickerProps) => (
	<Popover
		trigger="click"
		placement="bottomLeft"
		content={
			<div className="grid w-72 grid-cols-3 gap-1.5">
				{options.map((option) => {
					return (
						<button
							key={option.label}
							type="button"
							onClick={() => onChange({ id: option.label.toLowerCase(), label: option.label, icon: option.icon })}
							className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs text-slate-600 transition hover:bg-slate-100">
							<span className="flex items-center gap-1 text-xl">
								{option.icon}
								{/* <Icon size={12} className="text-slate-400" /> */}
							</span>
							<span>{option.label}</span>
						</button>
					);
				})}
			</div>
		}>
		<button
			type="button"
			className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold transition ${value ? "bg-amber-50 text-amber-700" : "text-slate-600 hover:bg-slate-100"}`}>
			<span className="text-lg">{value?.icon ?? "🙂"}</span>
			{value ? value.label : "Feeling / Activity"}
		</button>
	</Popover>
);

export default FeelingActivityPicker;
