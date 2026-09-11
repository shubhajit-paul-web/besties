import type { AttachmentCategory, PostAttachment } from "../types/createPost.types";

export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const MAX_IMAGES = 10;

const categoryLabel: Record<AttachmentCategory, string> = {
	image: "images",
	video: "a video",
	pdf: "a PDF",
};

export const validateFiles = (files: File[], category: AttachmentCategory, existing: PostAttachment[] = []) => {
	if (existing.length > 0 && existing[0].category !== category) {
		return `A post can contain only ${categoryLabel[existing[0].category]} or ${categoryLabel[category]}, not both.`;
	}

	if (category === "image" && existing.length + files.length > MAX_IMAGES) {
		return `You can add up to ${MAX_IMAGES} images.`;
	}

	if (category !== "image" && files.length > 1) {
		return `You can add only one ${category === "video" ? "video" : "PDF"}.`;
	}

	if (category === "image" && [...existing.map((attachment) => attachment.file), ...files].reduce((total, file) => total + file.size, 0) > MAX_FILE_SIZE) {
		return "Images must be 100 MB or smaller in total.";
	}

	for (const file of files) {
		const isValidType = category === "image" ? file.type.startsWith("image/") : category === "video" ? file.type.startsWith("video/") : file.type === "application/pdf";

		if (!isValidType) {
			return `That file is not a supported ${category}.`;
		}

		if (file.size > MAX_FILE_SIZE) {
			return `${file.name} is larger than 100 MB.`;
		}
	}

	return null;
};

export const formatFileSize = (bytes: number) => {
	if (bytes < 1024 * 1024) {
		return `${Math.max(1, Math.round(bytes / 1024))} KB`;
	}

	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
