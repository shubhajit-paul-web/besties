import axios from "axios";

/**
 * Extracts a user-friendly error message from an upload failure,
 * mapping common HTTP status codes (e.g., payload size, permission limits)
 */
const getFileUploadErrorMessage = (error: unknown): string => {
	if (!axios.isAxiosError(error)) {
		return "Failed to upload file. Please try again.";
	}

	switch (error.response?.status) {
		case 403:
			return "Upload rejected. Please check the file type or permissions.";

		case 413:
			return "File is too large for upload.";

		default:
			return error.response?.data?.message ?? "Failed to upload file. Please try again.";
	}
};

export default getFileUploadErrorMessage;
