import { authApi } from "@/lib/axios";

export const logoutUserApi = async () => {
	return authApi.post("/auth/logout");
};
