import { useState, type Dispatch, type SetStateAction } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Info, Eye, EyeOff, ChevronDown } from "lucide-react";
import InputField from "../InputField";
import Button from "../Button";
import bestiesLogo from "../../../assets/besties-logo.png";
import HttpInterceptor from "../../../lib/HttpInterceptor";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { SignupFormData, SignupFormPayload } from "../../../types/user.types";

type InitiateRegistrationProps = {
	setStep: Dispatch<SetStateAction<number>>;
	setSubmittedFormData: Dispatch<SetStateAction<SignupFormPayload | undefined>>;
};

const InitiateRegistration = ({ setStep, setSubmittedFormData }: InitiateRegistrationProps) => {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignupFormData>({});

	const currentDate = new Date().toISOString().split("T")[0];

	// Register user
	const initiateRegistration = async (data: SignupFormData) => {
		setIsLoading(true);

		const formData = {
			...data,
			name: {
				first: data.firstName,
				last: data.lastName,
			},
		};

		console.log(formData);

		try {
			const res = await HttpInterceptor.post("/auth/register", formData);

			if (res.status === 201) {
				toast.success("OTP sent successfully.", {
					position: "top-center",
				});

				setSubmittedFormData(formData);
				setStep(2);
			}
		} catch (err) {
			console.log(err);

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

	return (
		<div className="min-h-screen flex justify-center items-center font-sans overflow-y-auto select-none">
			<div className="bg-white w-full max-w-3xl p-20 md:p-15 flex flex-col">
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
				<form onSubmit={handleSubmit(initiateRegistration)} className="flex flex-col gap-5">
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
							<ChevronDown size={16} className="absolute right-4 top-4.25 text-slate-400 pointer-events-none" />
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
								className="absolute right-4 top-4.25 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
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
								setValueAs: (value) => (value === "" ? undefined : value),
								validate: (value) => {
									if (!value) return;
									const mobileRegex = /^\d{10}$/;
									return mobileRegex.test(value) || "Enter a valid 10-digit mobile number";
								},
							})}
							error={errors.mobileNumber}
						/>
						<InputField type="date" max={currentDate} {...register("dob", { required: "Date of birth is required" })} error={errors.dob} />
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
		</div>
	);
};

export default InitiateRegistration;
