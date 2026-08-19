import { useState } from "react";
import type { LoginFormPayload } from "../types/login.types";
import { toast } from "react-toastify";
import axios from "axios";
import { loginUserApi } from "../apis/auth.api";

const useLoginUser = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleLoginUser = async (data: LoginFormPayload) => {
		setIsSubmitting(true);

		try {
			await loginUserApi(data);

			toast.success("Login successful", {
				position: "top-center",
			});

			setTimeout(() => {
				location.href = "/app/home";
			}, 1500);
		} catch (err) {
			if (axios.isAxiosError(err)) {
				console.error(err);

				return toast.error(err.response?.data?.message ?? "Internal server error", {
					position: "top-center",
					style: { width: "365px" },
				});
			}

			toast.error("Login faild", {
				position: "top-center",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return { isSubmitting, handleLoginUser };
};

export default useLoginUser;
