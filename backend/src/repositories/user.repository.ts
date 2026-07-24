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

// const updateRefreshTokenById = async (userId: string, refreshToken: string) => {
//     return await UserModel.findByIdAndUpdate(
//         userId,
//         {
//             refreshToken,
//         },
//         { new: true },
//     );
// };

const findUserByIdentifier = async (identifier: string, fields: string) => {
    return await UserModel.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    }).select(fields);
};

export default {
    existsByUsername,
    existsByEmailOrMobile,
    create,
    findUserByIdentifier,
};
