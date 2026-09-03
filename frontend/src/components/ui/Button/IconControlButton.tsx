import { type LucideIcon } from "lucide-react";
import type { ComponentProps } from "react";

interface IconControlButtonProps extends ComponentProps<"button"> {
	activeIcon: LucideIcon;
	inActiveIcon: LucideIcon;
	iconSize?: number;
	isActive?: boolean;
}

const activeButtonStyle = "bg-white text-slate-700 border border-slate-300 hover:bg-slate-200/80";
const inActiveButtonStyle = "bg-red-500 text-white hover:bg-red-700 active:bg-red-800";

const IconControlButton = ({ activeIcon: ActiveIcon, inActiveIcon: InActiveIcon, iconSize = 20, isActive = false, ...props }: IconControlButtonProps) => {
	return (
		<button className={`transition-colors p-4 rounded-full cursor-pointer ${isActive ? activeButtonStyle : inActiveButtonStyle}`} {...props}>
			{isActive ? <ActiveIcon size={iconSize} /> : <InActiveIcon size={iconSize} />}
		</button>
	);
};

export default IconControlButton;
