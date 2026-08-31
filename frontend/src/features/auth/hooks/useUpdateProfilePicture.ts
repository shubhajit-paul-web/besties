import { useState } from "react";
import type { ProfilePictureFormData } from "../types/user.types";
import { toast, type ToastOptions } from "react-toastify";
import { generateSignedUrlForProfilePicApi, updateProfilePicUrl } from "../apis/user.api";
import type { AxiosResponse } from "axios";
import { mutate } from "swr";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { uploadFileToS3 } from "@/apis/storage.api";
import type { PresignedPostResponse } from "@/types/s3.types";

const useUpdateProfilePicture = () => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleUpdateProfilePicture = (data: ProfilePictureFormData) => {
		setIsSubmitting(true);

		const file = data.profilePicture?.[0];
		const formData = new FormData();

		const toastPosition: ToastOptions = {
			position: "top-center",
		};

		if (!file) return;

		// Step 1 - Generate signed upload url
		generateSignedUrlForProfilePicApi(file.type)
			.then(async (res: AxiosResponse<PresignedPostResponse>) => {
				const { fields, url } = res.data;

				Object.entries(fields).forEach(([key, value]) => {
					formData.append(key, value);
				});

				if (file) {
					formData.append("Content-Type", file.type);
					formData.append("file", file);
				}

				try {
					// Step 2 - Upload the file to s3
					const response = await uploadFileToS3(url, formData);

					// Step 3 - Update the avatar in the DB
					if (response.status === 204) {
						try {
							await updateProfilePicUrl(fields.key);

							toast.success("Profile picture updated successfully.", toastPosition);

							setTimeout(() => {
								mutate("/users/me");

								navigate("/app");
							}, 1500);
						} catch (err) {
							toast.error("Failed to upload file.", toastPosition);

							console.error(err);
						}
					}
				} catch (err) {
					if (axios.isAxiosError(err)) {
						switch (err.response?.status) {
							case 403:
								toast.error("Upload rejected. Please check the file type or size.", toastPosition);
								break;

							case 413:
								toast.error("File is too large.", toastPosition);
								break;

							default:
								toast.error("Failed to upload file.", toastPosition);
						}
					}
				}
			})
			.catch((err) => {
				toast.error("Failed to upload file.", toastPosition);

				console.error(err);
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	return { isSubmitting, handleUpdateProfilePicture };
};

export default useUpdateProfilePicture;
