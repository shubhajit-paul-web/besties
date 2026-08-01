export type UserType = {
	_id: string;
	username: string;
	name: {
		first: string;
		last?: string;
	};
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
	gender: "female" | "male" | "custom" | "";
	email: string;
	mobileNumber?: string;
	password: string;
	profilePicture?: FileList;
};
