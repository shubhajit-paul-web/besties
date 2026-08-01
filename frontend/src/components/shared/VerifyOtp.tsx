import { useForm } from "react-hook-form";
import Button from "./Button";
import InputField from "./InputField";
import type { SignupFormData } from "../../types/user.types";
import HttpInterceptor from "../../lib/HttpInterceptor";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAppContext from "../../hooks/useAppContext";
import { useState } from "react";
import { AxiosError } from "axios";

const VerifyOtp = ({ formData }: { formData: any }) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { setUser } = useAppContext();
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ otp: string }>({});

	const verifyRegistrationOtp = async ({ otp }: { otp: string }) => {
		setIsSubmitting(true);
		console.log("formData", formData);

		try {
			const res = await HttpInterceptor.post("/auth/register/verify", {
				...formData,
				otp,
			});

			if (res.status === 201) {
				toast.success("Signup successful.", {
					position: "top-center",
				});

				setTimeout(() => {
					navigate("/app");
				}, 2000);

				setUser(res.data?.data?.user);
			}
		} catch (err) {
			console.error(err);
			if (err instanceof AxiosError) {
				const data = err.response?.data;
				const status = err.response?.status;

				if (data?.errors) {
					return toast.error(err.response?.data?.message ?? "Validation faild", {
						position: "bottom-right",
						style: { width: "250px" },
					});
				}

				if (status === 400) {
					return toast.error(data?.message ?? "Verification faild", {
						position: "top-center",
					});
				}
			}

			console.error(err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="w-screen h-screen absolute top-0 left-0 z-50 flex justify-center items-center">
			<div className="w-120">
				<div className="space-y-1.5">
					<h1 className="text-2xl font-semibold">Enter the confirmation code</h1>
					<p className="leading-5">
						To confirm your account, enter the 6-digit code that we've sent to <span className="font-semibold">example@gmail.com.</span>
					</p>
				</div>
				<form onSubmit={handleSubmit(verifyRegistrationOtp)} className="space-y-6 mt-6">
					<InputField
						type="text"
						inputMode="numeric"
						maxLength={6}
						placeholder="Confirmation code"
						{...register("otp", {
							required: "Please check the email that we sent and enter that 6-digit code.",
							pattern: {
								value: /^\d{6}$/,
								message: "OTP must be exactly 6 digits",
							},
						})}
						error={errors.otp}
					/>
					<div className="space-y-3">
						<Button type="submit" variant="pink" width="100%" borderRadius="full" centerContent className="py-3" disabled={isSubmitting}>
							{isSubmitting ? (
								<div className="flex items-center gap-2 justify-center">
									<div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
									<span>Wait...</span>
								</div>
							) : (
								"Confirm"
							)}
						</Button>
						<Button variant="graySoft" width="100%" borderRadius="full" centerContent className="py-3">
							Resend confirmation code
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default VerifyOtp;
