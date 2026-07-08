import type { LucideIcon } from "lucide-react"
import type { ButtonHTMLAttributes, ReactNode } from "react"

const buttonBackgroundVariants = {
	primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white",
	secondary: "bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white",
	success: "bg-green-600 hover:bg-green-700 active:bg-green-800 text-white",
	danger: "bg-red-600 hover:bg-red-700 active:bg-red-800 text-white",
	warning: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 text-white",
	info: "bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800 text-white",
	purple: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white",
	pink: "bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white",
	indigo: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white",
	teal: "bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white",
	orange: "bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white",
	dark: "bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white",
	light: "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600",
}

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