import type { LucideIcon } from "lucide-react"
import type { ButtonHTMLAttributes, ReactNode } from "react"

const buttonBackgroundVariants = {
	primary: "bg-blue-600 hover:bg-blue-700 active:bg-blue-800",
	secondary: "bg-gray-600 hover:bg-gray-700 active:bg-gray-800",
	success: "bg-green-600 hover:bg-green-700 active:bg-green-800",
	danger: "bg-red-600 hover:bg-red-700 active:bg-red-800",
	warning: "bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700",
	info: "bg-cyan-600 hover:bg-cyan-700 active:bg-cyan-800",
	purple: "bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
	pink: "bg-pink-600 hover:bg-pink-700 active:bg-pink-800",
	indigo: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
	teal: "bg-teal-600 hover:bg-teal-700 active:bg-teal-800",
	orange: "bg-orange-600 hover:bg-orange-700 active:bg-orange-800",
	dark: "bg-slate-900 hover:bg-slate-800 active:bg-slate-950",
	light: "bg-gray-100 hover:bg-gray-200 active:bg-gray-300",
}

interface ButtonInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
	children?: ReactNode
	icon?: LucideIcon
	iconSize?: number
	variant?: keyof typeof buttonBackgroundVariants
	type?: "button" | "submit" | "reset"
	className?: string
}

const Button = ({ children, icon: Icon, iconSize = 20, variant = "primary", type = "button", className, ...props }: ButtonInterface) => {
	return (
		<button className={`flex items-center gap-2 cursor-pointer text-white py-2 px-4 rounded-lg transition-colors leading-tight ${buttonBackgroundVariants[variant]} ${className}`} type={type} {...props}>
			{Icon && <Icon size={iconSize} />}
			{children}
		</button>
	)
}

export default Button