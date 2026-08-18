import { useState } from "react";
import type { VerifyOtpProps } from "../types/registration.types";
import { toast } from "react-toastify";
import axios from "axios";
import { verifyRegistrationOtpApi } from "../apis/auth.api";

const useVerifyRegistrationOtp = ({ setStep, submittedFormData }: VerifyOtpProps) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const handleVerifyRegistrationOtp = async ({ otp }: { otp: string }) => {
		setIsSubmitting(true);

		if (!submittedFormData) return;

		try {
			await verifyRegistrationOtpApi({
				...submittedFormData,
				otp,
			});

			toast.success("Signup successful.", {
				position: "top-center",
			});

			setIsSuccess(true);

			setTimeout(() => {
				setStep(3);
			}, 2000);
		} catch (err) {
			console.error(err);

			if (axios.isAxiosError(err)) {
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

			toast.error("Verification faild", {
				position: "top-center",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return { isSubmitting, isSuccess, handleVerifyRegistrationOtp };
};

export default useVerifyRegistrationOtp;
