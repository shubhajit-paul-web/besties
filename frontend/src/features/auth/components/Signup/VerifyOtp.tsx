import { useForm } from "react-hook-form";
import Button from "../../../../components/ui/Button/Button";
import InputField from "../../../../components/ui/InputField";
import { CheckCircle2 } from "lucide-react";
import type { VerifyOtpProps } from "../../types/registration.types";
import useVerifyRegistrationOtp from "../../hooks/useVerifyRegistrationOtp";

const VerifyOtp = ({ setStep, submittedFormData }: VerifyOtpProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ otp: string }>({});

	const { isSuccess, isSubmitting, handleVerifyRegistrationOtp } = useVerifyRegistrationOtp({ setStep, submittedFormData });

	if (isSuccess) {
		return (
			<div className="h-screen flex justify-center items-center">
				<div className="w-full max-w-md p-10 rounded-4xl flex flex-col items-center text-center">
					<CheckCircle2 size={64} className="text-[#FF3D94] mb-5" />
					<h2 className="font-bold text-2xl text-slate-800 mb-2">Account Created!</h2>
					<p className="text-slate-500 text-base mb-8">Welcome to Besties. Redirecting you to app...</p>
					<div className="w-10 h-10 border-4 border-slate-100 border-t-[#FF3D94] rounded-full animate-spin"></div>
				</div>
			</div>
		);
	}

	return (
		<div className="w-screen h-screen absolute top-0 left-0 z-50 flex justify-center items-center">
			<div className="w-120">
				<div className="space-y-1.5">
					<h1 className="text-2xl font-semibold">Enter the confirmation code</h1>
					<p className="leading-5">
						To confirm your account, enter the 6-digit code that we've sent to <span className="font-semibold">{submittedFormData?.email ?? "example@gmail.com"}.</span>
					</p>
				</div>
				<form onSubmit={handleSubmit(handleVerifyRegistrationOtp)} className="space-y-6 mt-6">
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
						<Button variant="graySoft" width="100%" borderRadius="full" centerContent className="py-3" disabled={isSubmitting}>
							Resend confirmation code
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default VerifyOtp;
