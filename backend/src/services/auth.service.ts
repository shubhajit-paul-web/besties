import type { VerifyRegistrationOtpInput } from "../validators/auth.validator.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import logger from "../utils/logger.js";
import type { LoginUserInput } from "../types/auth/auth.types.js";
import { InitiateRegistration } from "../types/auth/auth.types.js";
import redis from "../config/redis.js";
import generateOtp from "../utils/generateOtp.js";
import emailService from "./email.service.js";
import verificationTemplate from "../templates/email/verification.js";
import { RefreshAuthType } from "../types/auth/auth.request.js";
import { sha256 } from "../utils/crypto.js";

const isUserAlreadyExist = async (userData: InitiateRegistration) => {
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
};

const initiateRegistration = async (userData: InitiateRegistration) => {
    const { username, email, mobileNumber } = userData;

    await isUserAlreadyExist({
        username,
        email,
        mobileNumber,
    });

    const key = `auth:register:otp:email:${email}`;

    const existingOtp = await redis.get(key);

    if (existingOtp) {
        const ttl = await redis.ttl(key);

        throw new ApiError(StatusCodes.CONFLICT, "An OTP has already been sent.", true, {
            meta: {
                retryAfter: ttl,
            },
        });
    }

    const OTP = generateOtp();

    await redis.set(key, OTP, "EX", 5 * 60); // valid for 5 minutes

    await emailService.sendEmail({
        subject: "Verify your email",
        to: email,
        html: verificationTemplate(OTP, 5),
    });
};

const verifyRegistrationOtp = async (userData: VerifyRegistrationOtpInput) => {
    const { username, email, mobileNumber, otp: submittedOtp } = userData;

    await isUserAlreadyExist({
        username,
        email,
        mobileNumber,
    });

    const key = `auth:register:otp:email:${email}`;

    const expectedOtp = await redis.get(key);

    if (!expectedOtp) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "The OTP has expired. Please request a new one.",
        );
    }

    if (expectedOtp !== submittedOtp) {
        throw new ApiError(
            StatusCodes.BAD_REQUEST,
            "The OTP you entered is incorrect. Please try again.",
        );
    }

    await redis.del(key);

    const { name, gender, dob, password } = userData;

    const userPayload = {
        username,
        name,
        gender,
        dob: new Date(dob),
        email,
        mobileNumber,
        password,
    };

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

const logout = (refreshToken: string | undefined) => {
    if (!refreshToken) return;

    const refreshTokenHash = sha256(refreshToken);

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    userRepository.removeRefreshToken(refreshTokenHash);
};

const refreshTokens = async (user: RefreshAuthType) => {
    const tokens = await user.generateAccessAndRefreshTokens();

    return tokens;
};

export default {
    initiateRegistration,
    verifyRegistrationOtp,
    loginUser,
    logout,
    refreshTokens,
};
