import { Skeleton } from "antd";

const ProfileCardSkeleton = ({ profilesCount = 4 }: { profilesCount?: number }) => (
	<div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
		{Array(profilesCount)
			.fill(0)
			.map((_, i) => (
				<div key={i} className="w-full rounded-xl border border-slate-200 overflow-hidden">
					<div className="w-full aspect-square">
						<Skeleton.Image active style={{ width: "100%", height: "100%" }} className="w-full! h-full! rounded-none!" />
					</div>

					<div className="p-3 space-y-3">
						<Skeleton.Input active size="small" />
						<Skeleton.Button active block />
						<Skeleton.Button active block />
					</div>
				</div>
			))}
	</div>
);

export default ProfileCardSkeleton;
