import z from "zod";
import { registerUserSchema } from "../validators/auth.validator.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";

// Types
interface LoginUser {
    identifier: string;
    password: string;
}

const registerUser = async (userData: z.infer<typeof registerUserSchema>) => {
    const { username, email, mobileNumber } = userData;

    const isUsernameAlreadyExists = await userRepository.existsByUsername(username);

    if (isUsernameAlreadyExists) {
        throw new ApiError(StatusCodes.CONFLICT, "Username is already taken");
    }

    const isUserAlreadyExist = await userRepository.existsByEmailOrMobile(email, mobileNumber);

    if (isUserAlreadyExist) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "An account with the provided email or phone number already exists",
        );
    }

    const { firstName, lastName, gender, dob, password } = userData;

    const userPayload = {
        username,
        name: {
            first: firstName,
            last: lastName,
        },
        gender,
        dob: new Date(dob),
        email,
        mobileNumber,
        password,
    };

    // check if the avatar file exists, verify it is an image format, upload it to cloud storage, and save the resulting secure URL and asset/image ID to your database

    const createdUser = await userRepository.create(userPayload);

    const tokens = await createdUser.generateAccessAndRefreshTokens();

    const { password: _p, refreshToken: _r, ...safeUserData } = createdUser.toObject();

    return { safeUserData, tokens };
};

const loginUser = async (credentials: LoginUser) => {
    const { identifier, password } = credentials;

    const user = await userRepository.findUserByIdentifier(identifier, "username email +password");

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "User doesn't exists, please try to login first");
    }

    const isCorrectPassword = await user.comparePassword(password);

    if (!isCorrectPassword) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const tokens = await user.generateAccessAndRefreshTokens();

    return { user, tokens };
};

export default {
    registerUser,
    loginUser,
};
