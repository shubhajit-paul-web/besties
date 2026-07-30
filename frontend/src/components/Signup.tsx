import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Info, Eye, EyeOff, Camera, Trash2, ChevronDown, CheckCircle2 } from "lucide-react";
import InputField from "./shared/InputField";
import Button from "./shared/Button";
import defaultAvatar from "../assets/default-user-avatar.png";
import bestiesLogo from "../assets/besties-logo.png";
import HttpInterceptor from "../lib/HttpInterceptor";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useAppContext from "../hooks/useAppContext";
import VerifyOtp from "./shared/VerifyOtp";

interface SignupFormData {
	username: string;
	firstName: string;
	lastName: string;
	dob: string;
	gender: "female" | "male" | "custom" | "";
	email: string;
	mobileNumber?: string;
	password: string;
	profilePicture?: FileList;
}

const Signup = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [previewUrl, setPreviewUrl] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [showOtpInput, setShowOtpInput] = useState(false);
	const { setUser } = useAppContext();

	const fileInputRef = useRef<HTMLInputElement>(null);

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
		trigger,
	} = useForm<SignupFormData>({});

	const watchedProfilePicture = watch("profilePicture");
	const currentDate = new Date().toISOString().split("T")[0];

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

	// Register user
	const registerUser = async (data: SignupFormData) => {
		setIsLoading(true);
		console.log("Submitting Signup Data:", data);

		const formData = new FormData(document.forms[0]);

		try {
			const res = await HttpInterceptor.post("/auth/register", formData);

			if (res.status === 201) {
				setIsSuccess(true);

				setTimeout(() => {
					navigate("/app");
				}, 2000);

				setUser(res.data?.data?.user);

				console.log(res.data?.data?.user);
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				const status = err.response?.status;

				// Input validation
				if (status === 400) {
					return toast.error(err.response?.data?.message ?? "Validation faild", {
						position: "bottom-right",
						style: { width: "250px" },
					});
				}

				// Business/database conflict
				if (status === 409) {
					return toast.error(err.response?.data?.message ?? "Something went wrong", {
						position: "top-center",
					});
				}

				// Network error (no response from server)
				if (!err.response) {
					return toast.error("Unable to connect to the server. Please check your internet connection.", {
						position: "top-center",
					});
				}
			}

			// Unknown/unexpected error
			toast.error("Something went wrong. Please try again.", {
				position: "top-center",
			});

			console.error(err);
		} finally {
			setIsLoading(false);
		}
	};

	// Common select styles to match InputField
	const selectBaseStyles = "w-full py-3.5 px-4 rounded-xl border bg-white focus:outline-none appearance-none cursor-pointer transition-all duration-200 text-slate-700";
	const selectNormalStyles = "border-slate-300 focus:border-slate-400";
	const selectErrorStyles = "border-red-500 focus:outline-red-500 text-red-500";

	if (showOtpInput) {
		return <VerifyOtp />;
	}

	return (
		<div className="min-h-screen flex justify-center items-center font-sans overflow-y-auto select-none">
			{isSuccess ? (
				<div className="w-full max-w-md p-10 rounded-4xl flex flex-col items-center text-center">
					<CheckCircle2 size={64} className="text-[#FF3D94] mb-5" />
					<h2 className="font-bold text-2xl text-slate-800 mb-2">Account Created!</h2>
					<p className="text-slate-500 text-base mb-8">Welcome to Besties. Redirecting you to app...</p>
					<div className="w-10 h-10 border-4 border-slate-100 border-t-[#FF3D94] rounded-full animate-spin"></div>
				</div>
			) : (
				<div className="bg-white w-full max-w-4xl p-20 md:p-15 flex flex-col">
					{/* Header */}
					<div className="flex flex-col items-center text-center mb-15">
						<div className="flex items-center gap-2 mb-3">
							<img className="h-8 w-auto object-contain" src={bestiesLogo} alt="Besties Logo" />
							<span className="font-bold text-2xl tracking-tight text-slate-800">Besties</span>
						</div>
						<h1 className="font-bold text-2xl md:text-3xl text-slate-800 leading-tight">Create your account</h1>
						<p className="text-slate-500 text-sm mt-2">Join us today. It's quick and easy.</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit(registerUser)} className="flex flex-col gap-5">
						{/* Row 1 */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<InputField
								type="text"
								placeholder="Username"
								{...register("username", {
									required: "Username is required",
									validate: (value) => {
										const usernameRegex = /^[a-zA-Z0-9_]+$/;

										return usernameRegex.test(value) || "Username can only contain letters, numbers, and underscores";
									},
								})}
								error={errors.username}
							/>
							<InputField
								type="email"
								placeholder="Email address"
								autoComplete="email"
								{...register("email", {
									required: "Email address is required",
									validate: (value) => {
										const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
										return emailRegex.test(value) || "Enter a valid email address";
									},
								})}
								error={errors.email}
							/>
						</div>

						{/* Row 2 */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<InputField type="text" placeholder="First name" {...register("firstName", { required: "First name is required" })} error={errors.firstName} />
							<InputField type="text" placeholder="Last name (Optional)" />
						</div>

						{/* Row 3 */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
							<div className="relative">
								<select {...register("gender", { required: "Please select your gender" })} className={`${selectBaseStyles} ${errors.gender ? selectErrorStyles : selectNormalStyles}`}>
									<option value="" disabled selected>
										Gender
									</option>
									<option value="female">Female</option>
									<option value="male">Male</option>
									<option value="custom">Custom</option>
								</select>
								<ChevronDown size={16} className="absolute right-4 top-[17px] text-slate-400 pointer-events-none" />
								{errors.gender && (
									<p className="text-sm text-red-500 mt-0.5 flex items-center gap-1">
										<Info size={15} />
										{errors.gender.message}
									</p>
								)}
							</div>
							<div className="relative">
								<InputField
									type={showPassword ? "text" : "password"}
									placeholder="New password"
									{...register("password", {
										required: "Password is required",
										minLength: {
											value: 8,
											message: "Must be at least 8 characters",
										},
										validate: (value) => {
											if (!/[A-Z]/.test(value)) {
												return "Must contain an uppercase letter";
											}
											if (!/[0-9]/.test(value)) {
												return "Must contain a number";
											}
											if (!/[^A-Za-z0-9]/.test(value)) {
												return "Must contain a special character";
											}
										},
									})}
									error={errors.password}
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-4 top-[17px] text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
									{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
								</button>
							</div>
						</div>

						{/* Row 4 - Profile Picture and Submit */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
							<InputField
								type="tel"
								placeholder="Mobile number (Optional)"
								inputMode="numeric"
								autoComplete="tel"
								maxLength={10}
								{...register("mobileNumber", {
									validate: (value) => {
										if (!value) return;
										const mobileRegex = /^\d{10}$/;
										return mobileRegex.test(value) || "Enter a valid 10-digit mobile number";
									},
								})}
								error={errors.mobileNumber}
							/>
							<InputField type="date" max={currentDate} {...register("dob", { required: "Date of birth is required" })} error={errors.dob} />

							<div className="md:col-span-2">
								<div
									className={`flex flex-col justify-center text-center items-center gap-4 p-10 bg-slate-50 rounded-2xl transition-colors ${errors.profilePicture ? "border border-red-300" : ""}`}>
									<div
										onClick={triggerFileSelect}
										className={`w-16 h-16 rounded-full border-2 border-dashed flex-shrink-0 ${
											errors.profilePicture ? "border-red-400 bg-red-50" : "border-slate-300 bg-white hover:border-[#FF3D94]"
										} transition-all duration-200 flex items-center justify-center cursor-pointer overflow-hidden relative group`}
										title="Upload profile picture">
										{previewUrl ? (
											<img src={previewUrl} alt="Profile Preview" className="w-full h-full object-cover" />
										) : (
											<img src={defaultAvatar} alt="Default Avatar" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" />
										)}
										<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center text-white">
											<Camera size={16} />
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-medium text-slate-700 truncate">
											{watchedProfilePicture && watchedProfilePicture.length > 0 ? watchedProfilePicture[0].name : "Profile Picture (Optional)"}
										</p>
										<p className="text-xs text-slate-400 mt-0.5">JPEG, PNG under 5 MB</p>
									</div>
									{previewUrl && (
										<button
											type="button"
											onClick={removeProfilePicture}
											className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors flex-shrink-0 cursor-pointer mr-1"
											title="Remove Photo">
											<Trash2 size={16} />
										</button>
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
							</div>
						</div>

						{/* Sign Up Button */}
						<div className="mt-5 m-auto">
							<Button
								variant="pink"
								type="submit"
								width="100%"
								borderRadius="xl"
								centerContent
								className="h-full min-h-13.75 px-12 text-base font-bold tracking-wide transition-all active:scale-[0.99] disabled:opacity-70"
								disabled={isLoading}>
								{isLoading ? (
									<div className="flex items-center gap-2 justify-center">
										<div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
										<span>Wait...</span>
									</div>
								) : (
									"Sign Up"
								)}
							</Button>
						</div>
					</form>

					{/* Navigation back to login */}
					<div className="mt-8 text-center text-sm">
						<span className="text-slate-500">Already have an account? </span>
						<Link to="/login" className="text-[#FF3D94] hover:text-[#D8337D] font-bold hover:underline inline-flex items-center justify-center gap-1">
							Log In
						</Link>
					</div>
				</div>
			)}
		</div>
	);
};

export default Signup;
