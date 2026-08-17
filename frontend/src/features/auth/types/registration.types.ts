import type { Dispatch, SetStateAction } from "react";

export interface InitiateRegistrationFormData {
	username: string;
	firstName: string;
	lastName: string;
	dob: string;
	gender: "female" | "male" | "custom";
	email: string;
	mobileNumber?: string;
	password: string;
}

export interface InitiateRegistrationFormPayload {
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
	setSubmittedFormData: Dispatch<SetStateAction<InitiateRegistrationFormPayload | undefined>>;
}

export interface VerifyOtpProps {
	setStep: Dispatch<SetStateAction<number>>;
	submittedFormData?: InitiateRegistrationFormPayload;
}
