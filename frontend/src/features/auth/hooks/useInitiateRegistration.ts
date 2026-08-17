import { useState } from "react";
import type { InitiateRegistrationFormData, InitiateRegistrationProps } from "../types/registration.types";
import { initiateRegistrationApi } from "../apis/auth.api";
import { toast } from "react-toastify";
import axios from "axios";

const useInitiateRegistration = ({ setStep, setSubmittedFormData }: InitiateRegistrationProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const handleInitiateRegistration = async (data: InitiateRegistrationFormData) => {
		setIsLoading(true);

		const formData = {
			...data,
			name: {
				first: data.firstName,
				last: data.lastName,
			},
		};

		try {
			await initiateRegistrationApi(formData);

			toast.success("OTP sent successfully.", {
				position: "top-center",
			});

			setSubmittedFormData(formData);
			setStep(2);
		} catch (err) {
			console.error(err);

			if (axios.isAxiosError(err)) {
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

	return { handleInitiateRegistration, isLoading };
};

export default useInitiateRegistration;
