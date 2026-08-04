import axios, { AxiosError } from "axios";

const HttpInterceptor = axios.create({
	baseURL: "http://localhost:8080",
	withCredentials: true,
});

type CustomAxiosError = AxiosError & {
	config: {
		_retry: boolean;
	};
};

// Refresh tokens
HttpInterceptor.interceptors.response.use(
	(response) => response,
	async (error: CustomAxiosError) => {
		const originalRequest = error.config;

		try {
			if (error.response?.status === 401 && !originalRequest?._retry) {
				originalRequest._retry = true;

				await HttpInterceptor.post("/auth/refresh");

				return HttpInterceptor(originalRequest);
			}
		} catch {
			window.location.href = "/login";
		}
	},
);

export default HttpInterceptor;
