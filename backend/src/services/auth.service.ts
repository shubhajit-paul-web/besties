import z from "zod";
import { registerUserSchema } from "../validators/auth.validator.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import UserModel from "../models/user.model.js";

interface JWTPayloadInterface {
    _id: string;
    username: string;
    email: string;
}

const generateAccessAndRefreshToken = async (payload: JWTPayloadInterface) => {
    try {
        const accessToken = jwt.sign(payload, config.JWT.ACCESS_TOKEN_SECRET!, {
            expiresIn: "10m",
        });
        const refreshToken = jwt.sign(payload, config.JWT.REFRESH_TOKEN_SECRET!, {
            expiresIn: "1y",
        });

        await UserModel.findByIdAndUpdate(payload._id, {
            refreshToken,
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal server error",
            false,
            "Error while generating jwt access and refresh token",
            String(error),
        );
    }
};

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

    const { password: _, ...safeUserData } = createdUser.toObject();

    return safeUserData;
};

export default {
    registerUser,
    generateAccessAndRefreshToken,
};
