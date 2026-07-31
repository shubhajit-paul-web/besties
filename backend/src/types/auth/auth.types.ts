export type LoginUserInput = {
    identifier: string;
    password: string;
};

export type InitiateRegistration = {
    username: string;
    email: string;
    mobileNumber?: string;
};
