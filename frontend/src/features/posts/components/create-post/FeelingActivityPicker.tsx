import { useState } from "react";
import { Popover } from "antd";
import { Search, X } from "lucide-react";
import type { FeelingActivityPickerProps } from "../../types/createPost.types";

type Category = "feeling" | "activity";

type FeelingItem = {
	id: string;
	label: string;
	icon: string;
	category: Category;
};

const options: FeelingItem[] = [
	// Feelings
	{ id: "happy", label: "Happy", icon: "😊", category: "feeling" },
	{ id: "loved", label: "Loved", icon: "🥰", category: "feeling" },
	{ id: "excited", label: "Excited", icon: "✨", category: "feeling" },
	{ id: "grateful", label: "Grateful", icon: "🙏", category: "feeling" },
	{ id: "blessed", label: "Blessed", icon: "😇", category: "feeling" },
	{ id: "relaxed", label: "Relaxed", icon: "😌", category: "feeling" },
	{ id: "proud", label: "Proud", icon: "🌟", category: "feeling" },
	{ id: "motivated", label: "Motivated", icon: "💪", category: "feeling" },
	{ id: "sad", label: "Sad", icon: "😔", category: "feeling" },
	{ id: "tired", label: "Tired", icon: "😴", category: "feeling" },
	{ id: "lonely", label: "Lonely", icon: "🌙", category: "feeling" },
	{ id: "angry", label: "Angry", icon: "😤", category: "feeling" },
	{ id: "cool", label: "Cool", icon: "😎", category: "feeling" },
	{ id: "hopeful", label: "Hopeful", icon: "🌈", category: "feeling" },
	{ id: "bored", label: "Bored", icon: "🥱", category: "feeling" },
	{ id: "silly", label: "Silly", icon: "😜", category: "feeling" },

	// Activities
	{ id: "celebrating", label: "Celebrating", icon: "🎉", category: "activity" },
	{ id: "watching", label: "Watching", icon: "📺", category: "activity" },
	{ id: "eating", label: "Eating", icon: "🍜", category: "activity" },
	{ id: "drinking", label: "Drinking", icon: "☕", category: "activity" },
	{ id: "listening", label: "Listening to", icon: "🎧", category: "activity" },
	{ id: "traveling", label: "Traveling to", icon: "✈️", category: "activity" },
	{ id: "reading", label: "Reading", icon: "📚", category: "activity" },
	{ id: "playing", label: "Playing", icon: "🎮", category: "activity" },
	{ id: "exercising", label: "Exercising", icon: "🏋️", category: "activity" },
	{ id: "working", label: "Working", icon: "💼", category: "activity" },
	{ id: "attending", label: "Attending", icon: "🎟️", category: "activity" },
	{ id: "thinking", label: "Thinking about", icon: "💭", category: "activity" },
];

const FeelingActivityPicker = ({ value, onChange }: FeelingActivityPickerProps) => {
	const [open, setOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<Category>("feeling");
	const [searchQuery, setSearchQuery] = useState("");

	const handleSelect = (option: FeelingItem) => {
		onChange({
			id: option.id,
			label: option.label,
			icon: option.icon,
		});
		setOpen(false);
		setSearchQuery("");
	};

	const filteredOptions = searchQuery.trim()
		? options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase().trim()))
		: options.filter((option) => option.category === activeTab);

	return (
		<Popover
			open={open}
			onOpenChange={setOpen}
			trigger="click"
			placement="topRight"
			arrow={false}
			content={
				<div className="w-80 sm:w-84 space-y-3 p-1">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-slate-100 pb-2">
						<span className="text-sm font-semibold text-slate-800">How are you feeling?</span>
						<button
							type="button"
							onClick={() => setOpen(false)}
							className="grid size-7 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
							title="Close">
							<X size={16} />
						</button>
					</div>

					{/* Tabs */}
					<div className="flex rounded-xl bg-slate-100 p-1">
						<button
							type="button"
							onClick={() => {
								setActiveTab("feeling");
								setSearchQuery("");
							}}
							className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
								activeTab === "feeling" && !searchQuery
									? "bg-white text-slate-800 shadow-xs"
									: "text-slate-500 hover:text-slate-800"
							}`}>
							Feelings
						</button>
						<button
							type="button"
							onClick={() => {
								setActiveTab("activity");
								setSearchQuery("");
							}}
							className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition ${
								activeTab === "activity" && !searchQuery
									? "bg-white text-slate-800 shadow-xs"
									: "text-slate-500 hover:text-slate-800"
							}`}>
							Activities
						</button>
					</div>

					{/* Search Bar */}
					<div className="relative">
						<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search feelings or activities..."
							className="w-full rounded-xl bg-slate-100 py-1.5 pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-500 transition"
						/>
						{searchQuery && (
							<button
								type="button"
								onClick={() => setSearchQuery("")}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
								<X size={13} />
							</button>
						)}
					</div>

					{/* Options Grid */}
					<div className="max-h-56 overflow-y-auto space-y-1 pr-1">
						{filteredOptions.length > 0 ? (
							<div className="grid grid-cols-2 gap-1.5">
								{filteredOptions.map((option) => {
									const isSelected = value?.id === option.id;
									return (
										<button
											key={option.id}
											type="button"
											onClick={() => handleSelect(option)}
											className={`flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition hover:bg-slate-100 ${
												isSelected ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-700"
											}`}>
											<span className="text-xl shrink-0 leading-none">{option.icon}</span>
											<span className="truncate text-xs font-medium">{option.label}</span>
										</button>
									);
								})}
							</div>
						) : (
							<div className="py-6 text-center text-xs text-slate-400">No feelings or activities found</div>
						)}
					</div>
				</div>
			}>
			<button
				type="button"
				className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold transition ${
					value ? "bg-amber-50 text-amber-700 hover:bg-amber-100 ring-1 ring-amber-200" : "text-slate-600 hover:bg-slate-100"
				}`}>
				<span className="text-base">{value?.icon ?? "🙂"}</span>
				<span>{value ? value.label : "Feeling / Activity"}</span>
			</button>
		</Popover>
	);
};

export default FeelingActivityPicker;
