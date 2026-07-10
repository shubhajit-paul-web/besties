import type { ButtonHTMLAttributes, ReactNode } from "react";

interface AvatarInterface extends ButtonHTMLAttributes<HTMLButtonElement> {
	image: string;
	imageShape?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
	title?: string;
	subtitle?: ReactNode;
	imageSize?: number;
	defaultAvatar?: string;
	className?: string;
}

/**
 * Avatar component to display a user profile image along with optional title and subtitle.
 * Supports fallback images and custom shaping.
 *
 * @component
 * @param {AvatarInterface} props - The properties for the Avatar component.
 * @param {string} props.image - The primary source URL for the avatar image.
 * @param {"none"|"sm"|"md"|"lg"|"xl"|"2xl"|"3xl"|"full"} [props.imageShape="full"] - The border-radius shape of the image.
 * @param {string} [props.title] - Optional main text/name displayed next to the avatar.
 * @param {ReactNode} [props.subtitle] - Optional subtext or element displayed below the title.
 * @param {number} [props.imageSize=36] - The width and height of the image in pixels.
 * @param {string} [props.defaultAvatar] - Fallback image URL if the primary image fails to load.
 * @param {string} [props.className=""] - Additional CSS classes for the root container.
 * * @returns {JSX.Element} The rendered Avatar component.
 */
const Avatar = ({ image, imageShape = "full", title, subtitle, imageSize = 36, defaultAvatar, className = "" }: AvatarInterface) => {
	return (
		<div className={`flex items-center gap-2.5 ${className}`}>
			<img
				className={`rounded-${imageShape} w-9 aspect-square object-cover object-center`}
				style={{ width: imageSize + "px" }}
				src={image}
				alt="avatar image"
				onError={(e) => {
					if (defaultAvatar) {
						e.currentTarget.onerror = null;
						e.currentTarget.src = defaultAvatar;
					}
				}}
			/>

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
