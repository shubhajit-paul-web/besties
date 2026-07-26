import { RegisterUserDto } from "../dto/user.dto.js";
import UserModel from "../models/user.model.js";

const existsByUsername = async (username: string) => {
    return await UserModel.exists({ username });
};

const existsByEmailOrMobile = async (email: string, mobileNumber: string | undefined) => {
    return await UserModel.exists({
        $or: [{ email }, { mobileNumber }],
    });
};

const create = async (userData: RegisterUserDto) => {
    return await UserModel.create(userData);
};

const findUserByIdentifier = async (identifier: string, fields: string) => {
    return await UserModel.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    }).select(fields);
};

const findUserById = async (userId: string, lean: boolean = true, fields?: string) => {
    const query = UserModel.findById(userId);

    if (lean) query.lean();
    if (fields) query.select(fields);

    return await query;
};

export default {
    existsByUsername,
    existsByEmailOrMobile,
    create,
    findUserByIdentifier,
    findUserById,
};
