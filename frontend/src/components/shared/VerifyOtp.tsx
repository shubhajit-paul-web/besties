import { useForm } from "react-hook-form";
import Button from "./Button";
import InputField from "./InputField";

const VerifyOtp = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<{ otp: string }>({});

	const confirmOtp = (data: { otp: string }) => {
		console.log(data);
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
				<form onSubmit={handleSubmit(confirmOtp)} className="space-y-6 mt-6">
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
						<Button type="submit" variant="primary" width="100%" borderRadius="full" centerContent className="py-3">
							Confirm
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
