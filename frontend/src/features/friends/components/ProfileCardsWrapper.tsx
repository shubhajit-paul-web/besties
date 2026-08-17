import type { ProfileCardsWrapperProps } from "../types/friend.types";

const ProfileCardsWrapper = ({ children, title, totalProfilesCount }: ProfileCardsWrapperProps) => {
	return (
		<div>
			<h1 className="text-xl font-medium flex items-center gap-2.5">
				<span>{title}</span>
				{(totalProfilesCount || totalProfilesCount === 0) && <span className="text-xs bg-white text-slate-600 border border-slate-300 py-0.5 px-2 rounded-full">{totalProfilesCount}</span>}
			</h1>

			<div className="mt-6 grid grid-cols-4 gap-3">{children}</div>
		</div>
	);
};

export default ProfileCardsWrapper;
