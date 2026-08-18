import type { InitiateRegistrationFormPayload } from "../types/registration.types";
import type { LoginFormPayload } from "../types/login.types";
import { authApi } from "../../../lib/axios";

export const initiateRegistrationApi = async (payload: InitiateRegistrationFormPayload) => {
	return authApi.post("/auth/registration/initiate", payload);
};

export const verifyRegistrationOtpApi = async (payload: InitiateRegistrationFormPayload) => {
	return authApi.post("/auth/registration/verify", payload);
};

export const loginUserApi = async (payload: LoginFormPayload) => {
	return authApi.post("/auth/login", payload);
};
