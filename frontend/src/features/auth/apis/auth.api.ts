import { authApi } from "../../../lib/axios";
import type { InitiateRegistrationFormPayload } from "../types/registration.types";

export const initiateRegistrationApi = async (data: InitiateRegistrationFormPayload) => {
	const response = await authApi.post("/auth/registration/initiate", data);

	return response;
};
