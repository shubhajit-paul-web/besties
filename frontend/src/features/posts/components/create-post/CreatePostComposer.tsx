import { useState } from "react";
import { ImagePlus, SmilePlus, Video } from "lucide-react";
import useCurrentUser from "@/hooks/useCurrentUser";
import CreatePostModal from "./CreatePostModal";
import formatUserName from "@/utils/formatUserName";

const CreatePostComposer = () => {
	const { user } = useCurrentUser();
	const [open, setOpen] = useState(false);
	const userName = formatUserName(user?.name);

	return (
		<>
			<section className="w-full max-w-150 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)] transition hover:shadow-[0_12px_34px_rgba(15,23,42,0.08)]">
				<div className="flex items-center gap-3">
					<img src={user?.avatar ?? "/profile-img.jpeg"} className="size-11 rounded-full object-cover" />
					<button type="button" onClick={() => setOpen(true)} className="flex-1 rounded-full bg-slate-50 px-5 py-3 text-left text-[15px] text-slate-400 transition hover:bg-slate-100">
						What's on your mind, {userName.split(" ")[0]}?
					</button>
				</div>
				<div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
					<div className="flex items-center gap-1 text-xs font-semibold text-slate-400">
						<span className="hidden sm:inline">Share something with your friends</span>
					</div>
					<div className="flex items-center gap-1">
						<button
							type="button"
							title="Add image"
							aria-label="Add image"
							onClick={() => setOpen(true)}
							className="grid size-9 place-items-center rounded-full text-emerald-500 transition hover:bg-emerald-50">
							<ImagePlus size={20} />
						</button>
						<button
							type="button"
							title="Add video"
							aria-label="Add video"
							onClick={() => setOpen(true)}
							className="grid size-9 place-items-center rounded-full text-sky-500 transition hover:bg-sky-50">
							<Video size={20} />
						</button>
						<button
							type="button"
							title="Feeling / Activity"
							aria-label="Feeling / Activity"
							onClick={() => setOpen(true)}
							className="grid size-9 place-items-center rounded-full text-amber-500 transition hover:bg-amber-50">
							<SmilePlus size={20} />
						</button>
					</div>
				</div>
			</section>
			<CreatePostModal open={open} onClose={() => setOpen(false)} />
		</>
	);
};

export default CreatePostComposer;
