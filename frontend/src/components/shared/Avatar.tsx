import type { ReactNode } from "react";

interface AvatarInterface {
	image: string;
	imageShape?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
	title?: string;
	subtitle?: ReactNode;
	imageSize?: number;
	className?: string;
}

const Avatar = ({ image, imageShape = "full", title, subtitle, imageSize = 36, className = "" }: AvatarInterface) => {
	return (
		<div className={`flex items-center gap-2.5 ${className}`}>
			<img className={`rounded-${imageShape} w-9 aspect-square object-cover object-center`} style={{ width: imageSize + "px" }} src={image} alt="avatar image" />

			{(title || subtitle) && (
				<div>
					{title && <div className="font-medium leading-tight">{title}</div>}
					{subtitle && <div className="leading-tight text-xs">{subtitle}</div>}
				</div>
			)}
		</div>
	);
};

export default Avatar;
