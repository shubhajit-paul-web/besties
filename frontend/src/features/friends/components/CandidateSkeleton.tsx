import { Skeleton } from "antd";

const CandidateSkeleton = () => (
	<div className="grid grid-cols-4 gap-4 w-full">
		{Array(4)
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

export default CandidateSkeleton;
