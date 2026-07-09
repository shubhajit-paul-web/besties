import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

const iconButtonVariants = {
	// Neutral
	default: "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-600",

	soft: "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700",

	subtle: "bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-slate-600",

	ghost: "hover:bg-slate-100 active:bg-slate-200 text-slate-500",

	// Brand
	primary: "bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-600",

	success: "bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-600",

	danger: "bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600",

	warning: "bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-600",

	info: "bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 text-cyan-600",

	purple: "bg-violet-50 hover:bg-violet-100 active:bg-violet-200 text-violet-600",

	indigo: "bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-600",

	pink: "bg-fuchsia-50 hover:bg-fuchsia-100 active:bg-fuchsia-200 text-fuchsia-600",

	teal: "bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-600",

	orange: "bg-orange-50 hover:bg-orange-100 active:bg-orange-200 text-orange-600",

	// Filled
	filled: "bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white",

	filledPrimary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white",

	// Special
	glass: "bg-white/70 hover:bg-white/90 active:bg-white border border-slate-200 text-slate-700 backdrop-blur-md",

	elevated: "bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-sm text-slate-700",

	// Google Meet Style
	meet: "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700",

	meetDanger: "bg-red-500 hover:bg-red-600 active:bg-red-700 text-white",

	// Facebook Style
	facebook: "bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700",

	// Circular FAB Style
	fab: "bg-white hover:bg-slate-100 active:bg-slate-200 shadow-md text-slate-700",

	fabPrimary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-md text-white",
};

interface IconButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: keyof typeof iconButtonVariants;
	icon: LucideIcon;
	iconSize?: number;
}

const IconButton = ({ variant = "default", icon: Icon, iconSize = 20, ...props }: IconButtonInterface) => {
	return (
		<button className={`${iconButtonVariants[variant]} p-2 rounded-full transition-all`} {...props}>
			<Icon size={iconSize} />
		</button>
	);
};

export default IconButton;
