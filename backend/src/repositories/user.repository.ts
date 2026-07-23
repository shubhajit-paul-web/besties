import { RegisterUserDto } from "../dto/user.dto.js";
import UserModel from "../models/user.model.js";

const existsByUsername = async (username: string) => {
    return await UserModel.exists({ username });
};

const existsByEmailOrMobile = async (email: string, mobileNumber: string | undefined) => {
    return await UserModel.exists({
        $or: [{ email, mobileNumber }],
    });
};

const create = async (userData: RegisterUserDto) => {
    return await UserModel.create(userData);
};

export default {
    existsByUsername,
    existsByEmailOrMobile,
    create,
};
