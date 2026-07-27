import type { RegisterUserInput } from "../validators/auth.validator.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.js";
import type { LoginUserInput } from "../types/auth/auth.types.js";

const registerUser = async (userData: RegisterUserInput) => {
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

    return { createdUser, tokens };
};

const loginUser = async (credentials: LoginUserInput, ip: unknown) => {
    const { identifier, password } = credentials;

    const user = await userRepository.findUserByIdentifier(identifier, "+password");

    if (!user) {
        logger.warn(`Login faild: Account not found`, { identifier, ip });

        throw new ApiError(StatusCodes.UNAUTHORIZED, "Incorrect email, username, or password");
    }

    const isCorrectPassword = await user.comparePassword(password);

    if (!isCorrectPassword) {
        logger.warn(`Login faild: Incorrect password`, { identifier, userId: user._id, ip });

        throw new ApiError(StatusCodes.UNAUTHORIZED, "Incorrect email, username, or password");
    }

    const tokens = await user.generateAccessAndRefreshTokens();

    return { user, tokens };
};

export default {
    registerUser,
    loginUser,
};
