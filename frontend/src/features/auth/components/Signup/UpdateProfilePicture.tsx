/* eslint-disable react-hooks/incompatible-library */
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Camera, CloudUpload, Info, Lock, Trash2 } from "lucide-react";
import Button from "../../../../components/ui/Button/Button";
import { HttpInterceptor } from "../../../../lib/axios";
import { toast, type ToastOptions } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { AxiosResponse } from "axios";
import axios from "axios";
import useAppContext from "../../../../hooks/useAppContext";
import { mutate } from "swr";

type ProfilePicture = {
	profilePicture?: FileList;
};

type PresignedPostResponse = {
	url: string;
	fields: Record<string, string>;
};

const UpdateProfilePicture = () => {
	const navigate = useNavigate();
	const { setUser } = useAppContext();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
		trigger,
	} = useForm<ProfilePicture>({});

	const watchedProfilePicture = watch("profilePicture");

	const {
		ref: fileRegisterRef,
		onChange: fileRegisterOnChange,
		...fileRegisterRest
	} = register("profilePicture", {
		validate: {
			lessThan5MB: (files) => {
				if (!files || files.length === 0) return true;
				return files[0].size <= 5 * 1024 * 1024 || "Profile picture must be under 5 MB";
			},
			isImage: (files) => {
				if (!files || files.length === 0) return true;
				return files[0].type.startsWith("image/") || "Only image files are allowed";
			},
		},
	});

	// Preview URL for selected profile picture
	useEffect(() => {
		if (watchedProfilePicture && watchedProfilePicture.length > 0) {
			const file = watchedProfilePicture[0];
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		} else {
			setPreviewUrl("");
		}
	}, [watchedProfilePicture]);

	const triggerFileSelect = () => {
		fileInputRef.current?.click();
	};

	const removeProfilePicture = () => {
		setValue("profilePicture", undefined);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	// Update avatar
	const updateAvatar = (data: ProfilePicture) => {
		setIsSubmitting(true);

		const file = data.profilePicture?.[0];
		const formData = new FormData();

		const toastPosition: ToastOptions = {
			position: "top-center",
		};

		// Step 1 - Generate signed upload url
		HttpInterceptor.post("/users/me/avatar/upload-url", {
			type: file?.type,
		})
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
					const response = await HttpInterceptor.post(url, formData, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					});

					// Step 3 - Update the avatar in the DB
					if (response.status === 204) {
						try {
							await HttpInterceptor.put("users/me/avatar", {
								path: fields.key,
							});

							toast.success("Profile picture updated successfully.", toastPosition);

							setTimeout(() => {
								setUser(null);
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

	return (
		<div className="h-screen flex justify-center items-center">
			<div className="min-w-150 max-w-200">
				<div className="text-center space-y-1.5 mb-12">
					<h1 className="font-semibold text-2xl text-zinc-800">Add a profile photo</h1>
					<p className="text-zinc-600">Help your friends recognize you (optional)</p>
				</div>
				<form onSubmit={handleSubmit(updateAvatar)}>
					<div
						className={`flex flex-col justify-center text-center items-center gap-4 py-15 px-20 bg-slate-50 rounded-2xl border border-red-300 transition-colors ${errors.profilePicture ? "border-red-300" : "border-zinc-200"}`}>
						<div
							onClick={triggerFileSelect}
							className={`w-30 h-30 rounded-full border-2 shrink-0 ${
								errors.profilePicture ? "border-red-400 bg-red-50" : "border-white bg-white hover:border-[#FF3D94]"
							} transition-all duration-200 flex items-center justify-center cursor-pointer overflow-hidden relative group`}
							title="Upload profile picture">
							{previewUrl ? (
								<img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
							) : (
								// <img src={defaultAvatar} alt="Default Avatar" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
								<div className="bg-pink-200/70 w-full h-full text-pink-500 flex justify-center items-center">
									<CloudUpload size={40} />
								</div>
							)}
							<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center text-white">
								<Camera size={35} />
							</div>
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-md font-medium text-slate-700 truncate">
								{watchedProfilePicture && watchedProfilePicture.length > 0 ? watchedProfilePicture[0].name : "Click to upload your profile photo"}
							</p>
							<p className="text-xs text-slate-400 mt-1">PNG or JPG • Max 5 MB</p>
						</div>
						{previewUrl && (
							<Button onClick={removeProfilePicture} variant="redSoft" borderColor="#FFC9C9" title="Remove Photo">
								<Trash2 size={16} />
								Remove
							</Button>
						)}
					</div>
					<input
						type="file"
						accept="image/*"
						ref={(e) => {
							fileInputRef.current = e;
							fileRegisterRef(e);
						}}
						onChange={(e) => {
							fileRegisterOnChange(e);
							trigger("profilePicture");
						}}
						{...fileRegisterRest}
						className="hidden"
					/>
					{errors.profilePicture && (
						<p className="text-sm text-red-500 mt-0.5 flex items-center gap-1">
							<Info size={15} />
							{errors.profilePicture.message}
						</p>
					)}
					<div className="flex justify-center gap-4 mt-12">
						<Button onClick={() => navigate("/app")} variant="lightUltra" borderColor="#c7c7c7" width="160px" centerContent>
							Skip for now
						</Button>
						<Button type="submit" variant="pink" width="160px" centerContent disabled={isSubmitting}>
							{isSubmitting ? (
								<div className="flex items-center gap-2 justify-center">
									<div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
									<span>Wait...</span>
								</div>
							) : (
								"Continue"
							)}
						</Button>
					</div>
				</form>
				<p className="text-zinc-500 flex justify-center items-center gap-1.5 mt-5">
					<Lock size={16} /> You can change this later from your profile settings.
				</p>
			</div>
		</div>
	);
};

export default UpdateProfilePicture;
