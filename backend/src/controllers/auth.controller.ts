import asyncHandler from "../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";
import authService from "../services/auth.service.js";
import getCookieOptions from "../utils/getCookieOptions.js";
import { ACCESS_TOKEN_COOKIE_EXPIRY, REFRESH_TOKEN_COOKIE_EXPIRY } from "../constants/constants.js";
import ApiResponse from "../utils/apiResponse.js";
import type {
    InitiateRegistrationRequest,
    LoginUserRequest,
    VerifyRegistrationOtpRequest,
} from "../types/auth/auth.request.js";

// Initiate registration
const initiateRegistration = asyncHandler(async (req: InitiateRegistrationRequest, res) => {
    await authService.initiateRegistration(req.body);

    return res.status(StatusCodes.CREATED).json(ApiResponse.success("OTP sent successfully."));
});

// Register User
const verifyRegistrationOtp = asyncHandler(async (req: VerifyRegistrationOtpRequest, res) => {
    const { createdUser, tokens } = await authService.verifyRegistrationOtp(req.body);

    res.cookie("accessToken", tokens.accessToken, getCookieOptions(ACCESS_TOKEN_COOKIE_EXPIRY));
    res.cookie("refreshToken", tokens.refreshToken, getCookieOptions(REFRESH_TOKEN_COOKIE_EXPIRY));

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.success("Account created successfully.", { user: createdUser }));
});

// Login user
const loginUser = asyncHandler(async (req: LoginUserRequest, res) => {
    const { user, tokens } = await authService.loginUser(req.body, req.ip);

    res.cookie("accessToken", tokens.accessToken, getCookieOptions(ACCESS_TOKEN_COOKIE_EXPIRY));
    res.cookie("refreshToken", tokens.refreshToken, getCookieOptions(REFRESH_TOKEN_COOKIE_EXPIRY));

    return res.status(StatusCodes.OK).json(ApiResponse.success("Login successfully.", { user }));
});

export default {
    initiateRegistration,
    verifyRegistrationOtp,
    loginUser,
};
