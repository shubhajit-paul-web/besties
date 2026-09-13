import { useState } from "react";
import { Popover } from "antd";
import { Check, Search, X } from "lucide-react";
import type { FeelingActivityPickerProps, FeelingOption } from "../../types/post.types";
import { FEELING_OPTIONS } from "../../constants/constants";

const FeelingActivityPicker = ({ value, onChange }: FeelingActivityPickerProps) => {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const handleSelect = (option: FeelingOption) => {
		if (value?.id === option.id) {
			onChange(null);
		} else {
			onChange({
				id: option.id,
				label: option.label,
				icon: option.icon,
			});
		}
		setOpen(false);
		setSearchQuery("");
	};

	const query = searchQuery.trim().toLowerCase();
	const filteredOptions = query ? FEELING_OPTIONS.filter((option) => option.label.toLowerCase().includes(query)) : FEELING_OPTIONS;

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

					{/* Search Bar */}
					<div className="relative">
						<Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
						<input
							type="text"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							placeholder="Search feelings..."
							className="w-full rounded-xl bg-slate-100 py-1.5 pl-8 pr-7 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 border border-transparent focus:border-blue-500 transition"
						/>
						{searchQuery && (
							<button type="button" onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
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
											className={`group flex items-center justify-between gap-2 rounded-xl px-2.5 py-2 text-left transition ${
												isSelected ? "border border-blue-200 bg-blue-50 text-blue-700 font-semibold shadow-2xs" : "border border-transparent text-slate-700 hover:bg-slate-100"
											}`}>
											<div className="flex items-center gap-2 min-w-0">
												<span className="text-lg shrink-0 leading-none select-none">{option.icon}</span>
												<span className={`truncate text-xs ${isSelected ? "font-semibold text-blue-700" : "font-medium text-slate-700"}`}>{option.label}</span>
											</div>
											{isSelected && <Check size={13} className="shrink-0 text-blue-600" />}
										</button>
									);
								})}
							</div>
						) : (
							<div className="py-6 text-center text-xs text-slate-400">No feelings found</div>
						)}
					</div>
				</div>
			}>
			<button
				type="button"
				className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition ${
					value ? "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100/80 font-semibold shadow-2xs" : "border border-transparent text-slate-600 hover:bg-slate-100 font-medium"
				}`}>
				<span className="text-base leading-none select-none">{value?.icon ?? "🙂"}</span>
				<span className="truncate max-w-44">{value ? value.label : "Feeling"}</span>
			</button>
		</Popover>
	);
};

export default FeelingActivityPicker;
