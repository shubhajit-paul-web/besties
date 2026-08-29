import type { Dispatch, SetStateAction } from "react";

export type InitiateRegistrationFormData = {
	username: string;
	firstName: string;
	lastName: string;
	dob: string;
	gender: "female" | "male" | "custom";
	email: string;
	mobileNumber?: string;
	password: string;
};

export type InitiateRegistrationFormPayload = {
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
};

export type InitiateRegistrationProps = {
	setStep: Dispatch<SetStateAction<number>>;
	setSubmittedFormData: Dispatch<SetStateAction<InitiateRegistrationFormPayload | undefined>>;
};

export type VerifyOtpProps = {
	setStep: Dispatch<SetStateAction<number>>;
	submittedFormData?: InitiateRegistrationFormPayload;
};
