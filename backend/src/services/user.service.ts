import { StatusCodes } from "http-status-codes";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/apiError.js";

const getCurrentUser = async (userId: string) => {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User not found.");
    }

    return user;
};

export default {
    getCurrentUser,
};
