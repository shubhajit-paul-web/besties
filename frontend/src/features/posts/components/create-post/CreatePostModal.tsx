import { useEffect, useState } from "react";
import { Button, Input, Modal, notification } from "antd";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import useCurrentUser from "@/hooks/useCurrentUser";
import type { CreatePostFormValues, CreatePostModalProps, CreatePostPayload, FileAttachmentPayload, PostVisibility, SupportedFileType } from "../../types/post.types";
import AiLabelToggle from "./AiLabelToggle";
import AttachmentPicker from "./AttachmentPicker";
import FeelingActivityPicker from "./FeelingActivityPicker";
import PostPreview from "./PostPreview";
import PostVisibilitySelector from "./PostVisibilitySelector";
import useUploadFile from "../../hooks/useUploadFile";
import { SUPPORTED_CONTENT_TYPES } from "../../constants/constants";
import { createPostApi } from "../../apis/post.api";
import formatUserName from "@/utils/formatUserName";

// Default user data to display if current user info is unavailable
const fallbackUser = {
	name: "You",
	avatar: "/profile-img.jpeg",
};

/**
 * Modal dialog for creating a new post.
 * Supports a two-step flow: Compose -> Preview -> Publish.
 */
const CreatePostModal = ({ open, onClose }: CreatePostModalProps) => {
	const { user } = useCurrentUser();
	const { uploadFiles } = useUploadFile();

	// Modal steps: "compose" (writing the post) or "preview" (reviewing before publishing)
	const [step, setStep] = useState<"compose" | "preview">("compose");

	// Error message states
	const [attachmentError, setAttachmentError] = useState<string | null>(null);
	const [formError, setFormError] = useState<string | null>(null);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notify, notifyUi] = notification.useNotification();

	// User info (fallback if not logged in)
	const userName = user ? formatUserName(user.name) : fallbackUser.name;
	const avatarUrl = user?.avatar ?? fallbackUser.avatar;

	// Form management via react-hook-form
	const { handleSubmit, control, setValue, reset, getValues } = useForm<CreatePostFormValues>({
		defaultValues: {
			content: "",
			visibility: "friends",
			feeling: null,
			isAIGenerated: false,
			attachments: [],
		},
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
			// Collect only valid, existing files from the form inputs
			const validFiles = formValues.attachments.map((attachment) => attachment.file).filter((file): file is File => Boolean(file));

			let uploadedAttachments: FileAttachmentPayload[] = [];

			if (validFiles.length > 0) {
				const uploadResult = await uploadFiles(validFiles);

				// Stop early if the upload failed or returned no file keys
				if (!uploadResult.success || !uploadResult.keys) {
					notify.error({
						title: "Upload failed",
						description: "Could not upload attachments.",
					});
					return;
				}

				// Match each uploaded storage key back to its original file and format
				uploadedAttachments = uploadResult.keys.flatMap((storageKey, index) => {
					const file = validFiles[index];
					const isSupported = SUPPORTED_CONTENT_TYPES.includes(file?.type as SupportedFileType);

					if (!file || !isSupported) return [];

					return [
						{
							path: storageKey,
							contentType: file.type as SupportedFileType,
						},
					];
				});
			}

			const payload: CreatePostPayload = {
				content: formValues.content.trim(),
				visibility: formValues.visibility,
				isAIGenerated: formValues.isAIGenerated,
				files: uploadedAttachments,
			};

			if (formValues.feeling?.id) {
				payload.feeling = formValues.feeling.id;
			}

			// Save the post to DB
			await createPostApi(payload);

			closeAndReset();
			notify.success({
				title: "Post published",
				description: "Your post is now ready to share.",
			});
		} catch (err) {
			console.error("[CreatePost] Failed to publish post:", err);

			notify.error({
				title: "Unable to publish post",
				description: "Please try again in a moment.",
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
					<form onSubmit={handleSubmit(goToPreview)} className="space-y-5 mt-4">
						{/* Author info and visibility dropdown */}
						<div className="flex items-center justify-between border-b border-slate-100 pb-4">
							<div className="flex items-center gap-3">
								<img src={avatarUrl} alt="" className="size-11 rounded-full object-cover" />
								<div>
									<p className="font-semibold text-slate-800 capitalize">{userName}</p>
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
									autoSize={{ minRows: 4, maxRows: 8 }}
									placeholder={`What's on your mind, ${userName.split(" ")[0]}?`}
									variant="borderless"
									className="resize-none! text-lg! shadow-none! outline-0! border-0!"
									autoFocus
								/>
							)}
						/>

						<div className="h-0.5" />

						{/* Selected feeling badge with remove button */}
						{values.feeling && (
							<div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/90 px-3.5 py-2 transition-all">
								<div className="flex items-center gap-2 min-w-0">
									<span className="text-base leading-none select-none">{values.feeling.icon}</span>
									<span className="truncate text-sm font-medium text-slate-700">
										{values.feeling.label.toLowerCase().includes("ing") ? values.feeling.label : `Feeling ${values.feeling.label}`}
									</span>
								</div>
								<button
									type="button"
									onClick={() => setValue("feeling", null, { shouldDirty: true })}
									className="group flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-200/70 hover:text-slate-800 transition"
									title="Remove feeling"
									aria-label="Remove feeling">
									<X size={13} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
									<span>Remove</span>
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
						<AiLabelToggle checked={values.isAIGenerated} onChange={(isAIGenerated) => setValue("isAIGenerated", isAIGenerated, { shouldDirty: true })} />

						{/* Inline form validation error */}
						{formError && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-600">{formError}</p>}

						{/* Continue to Preview button */}
						<Button
							htmlType="submit"
							type="primary"
							block
							disabled={!canContinue}
							className={`h-11! rounded-xl! font-semibold! text-sm! transition-all duration-200 ${
								canContinue
									? "bg-blue-600! hover:bg-blue-700! text-white! cursor-pointer! shadow-sm hover:shadow"
									: "bg-slate-100! text-slate-400! border-none! cursor-not-allowed! shadow-none!"
							}`}>
							Next <ArrowRight size={16} />
						</Button>
					</form>
				) : (
					/* Step 2: Post Preview & Publish */
					<div className="space-y-5">
						<PostPreview values={getValues()} avatarUrl={avatarUrl} userName={userName} />
						<div className="flex gap-3">
							{/* Back to Compose */}
							<Button block onClick={() => setStep("compose")} className="h-11! rounded-xl! font-semibold! text-slate-700! border-slate-200! hover:bg-slate-50!">
								<ArrowLeft size={16} /> Back
							</Button>
							{/* Final Publish button */}
							<Button
								block
								type="primary"
								loading={isSubmitting}
								onClick={handleSubmit(submitPost)}
								className="h-11! rounded-xl! bg-blue-600! font-semibold! text-white! hover:bg-blue-700! shadow-sm hover:shadow">
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
