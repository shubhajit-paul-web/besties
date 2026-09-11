import { FileText } from "lucide-react";
import type { PostPreviewProps } from "../../types/createPost.types";
import { formatFileSize } from "../../utils/attachmentValidation";
import PostVisibilitySelector from "./PostVisibilitySelector";

const PostPreview = ({ values, avatarUrl, userName }: PostPreviewProps) => (
	<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
		<div className="flex items-center gap-3 p-4">
			<img src={avatarUrl} alt="" className="size-11 rounded-full object-cover" />
			<div className="min-w-0">
				<p className="font-semibold text-slate-800">{userName}</p>
				<PostVisibilitySelector value={values.visibility} onChange={() => undefined} />
			</div>
		</div>
		<div className="space-y-3 px-4 pb-4">
			<p className="whitespace-pre-wrap text-[15px] leading-6 text-slate-700">{values.content}</p>
			{values.feeling && (
				<div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
					{values.feeling.icon} Feeling {values.feeling.label}
				</div>
			)}
			{values.attachments.length > 0 && (
				<div className="overflow-hidden rounded-xl">
					{values.attachments[0].category === "image" && (
						<div className={`grid gap-1 ${values.attachments.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
							{values.attachments.map((attachment) => (
								<img key={attachment.id} src={attachment.previewUrl} alt={attachment.file.name} className="max-h-72 w-full object-cover" />
							))}
						</div>
					)}
					{values.attachments[0].category === "video" && <video src={values.attachments[0].previewUrl} controls className="max-h-80 w-full bg-slate-950" />}
					{values.attachments[0].category === "pdf" && (
						<div className="flex items-center gap-3 bg-rose-50 p-4">
							<FileText size={30} className="text-rose-500" />
							<div>
								<p className="font-semibold text-slate-700">{values.attachments[0].file.name}</p>
								<p className="text-xs text-slate-500">PDF · {formatFileSize(values.attachments[0].file.size)}</p>
							</div>
						</div>
					)}
				</div>
			)}
			{values.aiLabel && <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">AI-generated content</span>}
		</div>
	</div>
);

export default PostPreview;
