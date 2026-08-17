export interface Author {
	id: string;
	name: string;
	avatarUrl: string;
}

export interface UserType {
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
}
