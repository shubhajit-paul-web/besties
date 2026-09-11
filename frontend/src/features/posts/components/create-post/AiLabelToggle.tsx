import { Switch, Tooltip } from "antd";
import { Info } from "lucide-react";
import type { AiLabelToggleProps } from "../../types/createPost.types";

const AiLabelToggle = ({ checked, onChange }: AiLabelToggleProps) => (
	<div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
		<div className="flex items-start gap-3">
			<span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-slate-500 shadow-sm">
				<span className="text-sm font-bold">AI</span>
			</span>
			<div>
				<div className="flex items-center gap-1.5 text-sm font-semibold text-slate-800">
					Add AI label{" "}
					<Tooltip title="Adds a visible label so people know this post contains AI-generated content.">
						<Info size={14} className="text-slate-400" />
					</Tooltip>
				</div>
				<p className="mt-0.5 text-xs text-slate-500">Label this post as AI-generated content.</p>
			</div>
		</div>
		<Switch checked={checked} onChange={onChange} aria-label="Add AI label" />
	</div>
);

export default AiLabelToggle;
