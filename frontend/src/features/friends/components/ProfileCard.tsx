import ImageWithFallback from "@/components/ui/ImageWithFallback";
import type { ProfileCardProps } from "../types/friend.types";

const ProfileCard = ({ children, name, image }: ProfileCardProps) => {
	return (
		<div className="bg-white border border-slate-300/75 overflow-hidden rounded-xl">
			<ImageWithFallback className="w-full aspect-square" src={image} fallback="/profile-img.jpeg" alt="Profile image" />
			<div className="p-2.5">
				<div className="font-medium text-slate-700 mb-4 capitalize text-left truncate">{name}</div>
				{children}
			</div>
		</div>
	);
};

export default ProfileCard;
