import type { Dispatch, SetStateAction } from "react";

export interface SignupFormData {
	username: string;
	firstName: string;
	lastName: string;
	dob: string;
	gender: "female" | "male" | "custom";
	email: string;
	mobileNumber?: string;
	password: string;
}

export interface SignupFormPayload {
	username: string;
	name: {
		first: string;
		last?: string;
	};
	dob: string;
	gender: "female" | "male" | "custom";
	email: string;
	mobileNumber?: string;
	password: string;
	otp?: string;
}

export interface InitiateRegistrationProps {
	setStep: Dispatch<SetStateAction<number>>;
	setSubmittedFormData: Dispatch<SetStateAction<SignupFormPayload | undefined>>;
}

export interface VerifyOtpProps {
	setStep: Dispatch<SetStateAction<number>>;
	submittedFormData?: SignupFormPayload;
}
