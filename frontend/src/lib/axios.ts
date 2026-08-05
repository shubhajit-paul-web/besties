import axios, { AxiosError } from "axios";

axios.defaults.baseURL = "http://localhost:8080";

export const authApi = axios.create({
	withCredentials: true,
});

export const HttpInterceptor = axios.create({
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

				await authApi.post("/auth/refresh");

				return HttpInterceptor(originalRequest);
			}
		} catch {
			await authApi.post("/auth/logout");
			window.location.href = "/login";
		}
	},
);
