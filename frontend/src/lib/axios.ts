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

// Keep track of the refresh request so we only send it once
let refreshPromise: Promise<unknown> | null = null;

// Handle failed responses so the app can refresh the session automatically
HttpInterceptor.interceptors.response.use(
	(response) => response,
	async (error: CustomAxiosError) => {
		const originalRequest = error.config;

		// If there is no request config, stop here
		if (!originalRequest) {
			return Promise.reject(error);
		}

		// Avoid trying to refresh the refresh endpoint itself
		if (originalRequest.url === "/auth/refresh") {
			return Promise.reject(error);
		}

		// If the server says the session is expired, try refreshing once
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Only send one refresh request at a time
				if (!refreshPromise) {
					refreshPromise = authApi.post("/auth/refresh").finally(() => {
						refreshPromise = null;
					});
				}

				await refreshPromise;

				// Retry the original request after the token is refreshed
				return HttpInterceptor(originalRequest);
			} catch (refreshError) {
				// If refresh fails, log the user out
				authApi.post("/auth/logout").catch(() => {});

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	},
);
