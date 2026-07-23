// Register User DTO
export interface RegisterUserDto {
    username: string;
    name: {
        first: string;
        last?: string;
    };
    gender: "male" | "female" | "custom";
    dob: Date;
    email: string;
    mobileNumber?: string;
    password: string;
}
