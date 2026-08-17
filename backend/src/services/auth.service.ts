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
import emailTemplates from "../templates/email/verification.js";
import { RefreshAuthType } from "../types/auth/auth.request.js";
import { sha256 } from "../utils/crypto.js";

const isUserAlreadyExist = async (userData: InitiateRegistration) => {
    const { username, email, mobileNumber } = userData;

    const isUsernameAlreadyExists = await userRepository.existsByUsername(username);

    if (isUsernameAlreadyExists) {
        throw new ApiError(StatusCodes.CONFLICT, "Username is already taken.");
    }

    const isUserAlreadyExist = await userRepository.existsByEmailOrMobile(email, mobileNumber);

    if (isUserAlreadyExist) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "An account with the provided email or phone number already exists.",
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

    const otpKey = `auth:register:otp:email:${email}`;
    const cooldownKey = `cooldown:auth:register:otp:email:${email}`;

    const cooldownTTL = await redis.ttl(cooldownKey);

    if (cooldownTTL > 0) {
        throw new ApiError(StatusCodes.CONFLICT, "An OTP has already been sent.", true, {
            meta: {
                retryAfter: cooldownTTL,
            },
        });
    }

    const OTP = generateOtp();

    await redis.set(otpKey, OTP, "EX", 5 * 60); // valid for 5 minutes
    await redis.set(cooldownKey, OTP, "EX", 60); // valid for 1 minute

    await emailService.sendEmail({
        subject: "Verify your email",
        to: email,
        html: emailTemplates.registrationOtpTemplate(OTP, 5),
    });
};

const verifyRegistrationOtp = async (userData: VerifyRegistrationOtpInput) => {
    const { username, email, mobileNumber, otp: submittedOtp } = userData;

    await isUserAlreadyExist({
        username,
        email,
        mobileNumber,
    });

    const otpKey = `auth:register:otp:email:${email}`;
    const cooldownKey = `cooldown:auth:register:otp:email:${email}`;

    const expectedOtp = await redis.get(otpKey);

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

    await redis.del(otpKey);
    await redis.del(cooldownKey);

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

const forgotPassword = async (identifier: string) => {
    const user = await userRepository.findUserByIdentifier(identifier, "email");

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Account doesn't exists.");
    }

    const { email } = user;

    const cooldownKey = `auth:forgot-password:otp:email:${email}`;

    const cooldownTTL = await redis.ttl(cooldownKey);

    if (cooldownTTL > 0) {
        throw new ApiError(StatusCodes.CONFLICT, "An OTP has already been sent.", true, {
            meta: {
                retryAfter: cooldownTTL,
            },
        });
    }

    const otpKey = `auth:forgot-password:otp:email:${email}`;

    const OTP = generateOtp();

    await redis.set(otpKey, OTP, "EX", 5 * 60); // valid for 5 minutes
    await redis.set(cooldownKey, OTP, "EX", 60); // valid for 1 minute

    await emailService.sendEmail({
        subject: "Reset Your Password – OTP Verification",
        to: email,
        html: emailTemplates.forgotPasswordOtpTemplate(OTP, 5),
    });
};

const resetPassword = async (identifier: string, newPassword: string, submittedOtp: string) => {
    const user = await userRepository.findUserByIdentifier(identifier, "email");

    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Account doesn't exists.");
    }

    const { email } = user;

    const otpKey = `auth:forgot-password:otp:email:${email}`;
    const cooldownKey = `auth:forgot-password:otp:email:${email}`;

    const expectedOtp = await redis.get(otpKey);

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

    await redis.del(otpKey);
    await redis.del(cooldownKey);

    // await userRepository;
};

export default {
    initiateRegistration,
    verifyRegistrationOtp,
    loginUser,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
};
