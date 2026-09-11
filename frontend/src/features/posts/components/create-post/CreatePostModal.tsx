import { useEffect, useState } from "react";
import { Button, Input, Modal, notification } from "antd";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import useCurrentUser from "@/hooks/useCurrentUser";
import { createPost } from "../../services/createPost.service";
import type { CreatePostFormValues, CreatePostModalProps, PostVisibility } from "../../types/createPost.types";
import AiLabelToggle from "./AiLabelToggle";
import AttachmentPicker from "./AttachmentPicker";
import FeelingActivityPicker from "./FeelingActivityPicker";
import PostPreview from "./PostPreview";
import PostVisibilitySelector from "./PostVisibilitySelector";

// Default user data to display if current user info is unavailable
const fallbackUser = {
	name: "You",
	avatar: "/profile-img.jpeg",
};

// Dynamic row limits for the post text area
const textAreaAutoSize = { minRows: 4, maxRows: 8 };

/**
 * Modal dialog for creating a new post.
 * Supports a two-step flow: Compose -> Preview -> Publish.
 */
const CreatePostModal = ({ open, onClose }: CreatePostModalProps) => {
	const { user } = useCurrentUser();

	// Modal steps: "compose" (writing the post) or "preview" (reviewing before publishing)
	const [step, setStep] = useState<"compose" | "preview">("compose");

	// Error message states
	const [attachmentError, setAttachmentError] = useState<string | null>(null);
	const [formError, setFormError] = useState<string | null>(null);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notify, notifyUi] = notification.useNotification();

	// Resolved user info (fallback if not logged in)
	const userName = user ? `${user.name.first} ${user.name.last ?? ""}`.trim() : fallbackUser.name;
	const avatarUrl = user?.avatar ?? fallbackUser.avatar;

	// Form management via react-hook-form
	const { handleSubmit, control, setValue, reset, getValues } = useForm<CreatePostFormValues>({
		defaultValues: { content: "", visibility: "friends", feeling: null, aiLabel: false, attachments: [] },
	});

	const values = useWatch({ control }) as CreatePostFormValues;

	// Validation: Ensure post has at least text, an attachment, or a feeling
	const hasBody = Boolean(values?.content?.trim() || values?.attachments?.length || values?.feeling);
	const canContinue = hasBody && !attachmentError;

	// Clean up image preview Object URLs when the component unmounts to prevent memory leaks
	useEffect(() => {
		return () => {
			getValues("attachments")?.forEach((attachment) => {
				URL.revokeObjectURL(attachment.previewUrl);
			});
		};
	}, [getValues]);

	// Reset form state, release preview URLs, and close modal
	const closeAndReset = () => {
		values?.attachments?.forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl));
		reset();
		setStep("compose");
		setAttachmentError(null);
		setFormError(null);
		onClose();
	};

	// Update audience visibility (Public, Friends, Only Me)
	const updateVisibility = (visibility: PostVisibility) => {
		setValue("visibility", visibility, { shouldDirty: true });
	};

	// Update list of attached media files
	const updateAttachments = (attachments: CreatePostFormValues["attachments"]) => {
		setValue("attachments", attachments, {
			shouldDirty: true,
			shouldValidate: true,
		});
	};

	// Validate and move to the preview step
	const goToPreview = () => {
		if (!canContinue) {
			setFormError("Add some text, an attachment, or a feeling before continuing.");
			return;
		}

		setFormError(null);
		setStep("preview");
	};

	// Send post payload and files to backend API
	const submitPost = async (formValues: CreatePostFormValues) => {
		if (!canContinue || isSubmitting) return;

		setIsSubmitting(true);

		try {
			await createPost({
				content: formValues.content.trim(),
				visibility: formValues.visibility,
				feeling: formValues.feeling,
				aiLabel: formValues.aiLabel,
				files: formValues.attachments.map((attachment) => attachment.file),
			});

			closeAndReset();
			notify.success({
				message: "Post published",
				description: "Your post is now ready to share.",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Dynamic modal header title based on active step
	const title = step === "compose" ? "Create post" : "Preview post";

	return (
		<>
			{notifyUi}
			<Modal
				open={open}
				centered
				onCancel={closeAndReset}
				destroyOnHidden
				footer={null}
				width={560}
				title={
					<div className="flex items-center gap-2">
						<span>{title}</span>
						{step === "preview" && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600">Review</span>}
					</div>
				}
				closeIcon={
					<span className="text-slate-500">
						<X size={18} />
					</span>
				}
				className="create-post-modal">
				{/* Step 1: Compose Post */}
				{step === "compose" ? (
					<form onSubmit={handleSubmit(goToPreview)} className="space-y-5">
						{/* Author info and visibility dropdown */}
						<div className="flex items-center justify-between border-b border-slate-100 pb-4">
							<div className="flex items-center gap-3">
								<img src={avatarUrl} alt="" className="size-11 rounded-full object-cover" />
								<div>
									<p className="font-semibold text-slate-800">{userName}</p>
									<PostVisibilitySelector value={values.visibility} onChange={updateVisibility} />
								</div>
							</div>
						</div>

						{/* Main text area input */}
						<Controller
							name="content"
							control={control}
							render={({ field }) => (
								<Input.TextArea
									{...field}
									autoSize={textAreaAutoSize}
									placeholder={`What's on your mind, ${userName.split(" ")[0]}?`}
									variant="borderless"
									className="resize-none! text-lg! shadow-none! placeholder:text-slate-400! outline-zinc-300!"
								/>
							)}
						/>

						<div className="h-0.5" />

						{/* Selected feeling badge with remove button */}
						{values.feeling && (
							<div className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
								<span>
									{values.feeling.icon} Feeling {values.feeling.label}
								</span>
								<button type="button" onClick={() => setValue("feeling", null)} className="text-xs underline">
									Remove
								</button>
							</div>
						)}

						{/* Image/Media attachments selector */}
						<AttachmentPicker attachments={values.attachments} onChange={updateAttachments} error={attachmentError} onError={setAttachmentError} />

						{/* Add feeling/activity trigger */}
						<div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
							<span className="text-sm font-semibold text-slate-500">Add to your post</span>
							<FeelingActivityPicker value={values.feeling} onChange={(feeling) => setValue("feeling", feeling, { shouldDirty: true })} />
						</div>

						{/* AI-generated content tag toggle */}
						<AiLabelToggle checked={values.aiLabel} onChange={(aiLabel) => setValue("aiLabel", aiLabel, { shouldDirty: true })} />

						{/* Inline form validation error */}
						{formError && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{formError}</p>}

						{/* Continue to Preview button */}
						<Button htmlType="submit" type="primary" block disabled={!canContinue} className="h-11! rounded-xl! bg-slate-900! font-semibold! text-white! hover:bg-emerald-600!">
							Next <ArrowRight size={16} />
						</Button>
					</form>
				) : (
					/* Step 2: Post Preview & Publish */
					<div className="space-y-5">
						<PostPreview values={getValues()} avatarUrl={avatarUrl} userName={userName} />
						<div className="flex gap-3">
							{/* Back to Compose */}
							<Button block onClick={() => setStep("compose")} className="h-11! rounded-xl!">
								<ArrowLeft size={16} /> Back
							</Button>
							{/* Final Publish button */}
							<Button block type="primary" loading={isSubmitting} onClick={handleSubmit(submitPost)} className="h-11! rounded-xl! bg-emerald-600! font-semibold! hover:bg-emerald-700!">
								Post
							</Button>
						</div>
					</div>
				)}
			</Modal>
		</>
	);
};

export default CreatePostModal;
