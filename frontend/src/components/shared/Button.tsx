import type { LucideIcon } from "lucide-react"
import type { ButtonHTMLAttributes, ReactNode } from "react"

const buttonBackgroundVariants = {
	// Solid
	primary: "bg-blue-500 hover:bg-blue-600/90 active:bg-blue-600 text-white",
	secondary: "bg-slate-600 hover:bg-slate-700 active:bg-slate-800 text-white",
	success: "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white",
	danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
	warning: "bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white",
	info: "bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white",

	// Brand Colors
	indigo: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white",
	purple: "bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white",
	pink: "bg-fuchsia-600 hover:bg-fuchsia-700 active:bg-fuchsia-800 text-white",
	teal: "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white",
	orange: "bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white",

	// Neutral
	dark: "bg-slate-900 hover:bg-slate-800 active:bg-black text-white",
	light: "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700",
	lightPlus: "bg-slate-200/70 hover:bg-slate-200 active:bg-slate-300 text-slate-700",

	// Soft Tinted (Social App Style)
	blueSoft: "bg-blue-50 hover:bg-blue-100 active:bg-blue-200 text-blue-700",
	greenSoft: "bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 text-emerald-700",
	redSoft: "bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-700",
	yellowSoft: "bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-700",
	purpleSoft: "bg-violet-50 hover:bg-violet-100 active:bg-violet-200 text-violet-700",
	indigoSoft: "bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-200 text-indigo-700",
	pinkSoft: "bg-fuchsia-50 hover:bg-fuchsia-100 active:bg-fuchsia-200 text-fuchsia-700",
	cyanSoft: "bg-cyan-50 hover:bg-cyan-100 active:bg-cyan-200 text-cyan-700",
	tealSoft: "bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-700",

	// Neutral Soft
	graySoft: "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700",

	// Premium
	glass: "bg-white/70 hover:bg-white/90 active:bg-white border border-slate-200 text-slate-700 backdrop-blur-md",
};

interface ButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode
	icon?: LucideIcon
	iconSize?: number
	variant?: keyof typeof buttonBackgroundVariants
	type?: "button" | "submit" | "reset"
	size?: "normal" | "small"
	className?: string
	direction?: "normal" | "reverse"
	borderRadius?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none"
}

const Button = ({ children, icon: Icon, iconSize = 20, variant = "primary", type = "button", size = "normal", className, direction = "normal", borderRadius = "lg", ...props }: ButtonInterface) => {
	return (
		<button className={`flex items-center gap-2 cursor-pointer rounded-${borderRadius} transition-colors leading-tight font-medium ${direction === "reverse" && "flex-row-reverse"} ${size === "normal" ? "py-2 px-4" : "text-xs py-0.5 px-3"} ${buttonBackgroundVariants[variant]} ${className}`} type={type} {...props}>
			{Icon && <Icon size={iconSize} />}
			{children}
		</button>
	)
}

export default Button