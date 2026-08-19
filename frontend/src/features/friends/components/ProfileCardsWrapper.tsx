import type { ProfileCardsWrapperProps } from "../types/friend.types";

const ProfileCardsWrapper = ({ children, title, totalProfilesCount }: ProfileCardsWrapperProps) => {
	return (
		<div className="w-full">
			<h1 className="flex items-center gap-2 text-lg font-medium sm:gap-2.5 sm:text-xl">
				<span>{title}</span>
				{(totalProfilesCount || totalProfilesCount === 0) && <span className="rounded-full border border-slate-300 bg-white px-2 py-0.5 text-xs text-slate-600">{totalProfilesCount}</span>}
			</h1>

			{children && <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>}
		</div>
	);
};

export default ProfileCardsWrapper;
