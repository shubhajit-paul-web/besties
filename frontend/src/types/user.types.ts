export type UserType = {
	_id: string;
	username: string;
	name: {
		first: string;
		last?: string;
	};
	avatar?: string;
	bio?: string;
	gender: "male" | "female" | "custom";
	dob: Date;
	email: string;
	mobileNumber?: string;
	createdAt: Date;
	updatedAt: Date;
};

export type SignupFormData = {
	username: string;
	firstName: string;
	lastName: string;
	dob: string;
	gender: "female" | "male" | "custom";
	email: string;
	mobileNumber?: string;
	password: string;
};

export type SignupFormPayload = {
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
