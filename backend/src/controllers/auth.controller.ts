import asyncHandler from "../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";
import authService from "../services/auth.service.js";
import getCookieOptions from "../utils/getCookieOptions.js";
import { ACCESS_TOKEN_COOKIE_EXPIRY, REFRESH_TOKEN_COOKIE_EXPIRY } from "../constants/constants.js";
import ApiResponse from "../utils/apiResponse.js";
import type {
    InitiateRegistrationRequest,
    LoginUserRequest,
    RefreshTokenRequest,
    VerifyRegistrationOtpRequest,
} from "../types/auth/auth.request.js";
import config from "../config/environment.js";
import type { CookieOptions } from "express";

// Initiate registration
const initiateRegistration = asyncHandler(async (req: InitiateRegistrationRequest, res) => {
    await authService.initiateRegistration(req.body);

    return res.status(StatusCodes.CREATED).json(ApiResponse.success("OTP sent successfully."));
});

// Verify registration OTP
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

const logout = asyncHandler((req: RefreshTokenRequest, res) => {
    authService.logout(req.cookies?.refreshToken);

    const options: CookieOptions = {
        httpOnly: true,
        secure: config.NODE_ENV === "prod",
        sameSite: "strict",
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);

    return res.status(StatusCodes.OK).json(ApiResponse.success("Logout successful."));
});

const refreshTokens = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken } = await authService.refreshTokens(req.refreshAuth!);

    res.cookie("accessToken", accessToken, getCookieOptions(ACCESS_TOKEN_COOKIE_EXPIRY));
    res.cookie("refreshToken", refreshToken, getCookieOptions(REFRESH_TOKEN_COOKIE_EXPIRY));

    return res.status(StatusCodes.OK).json(ApiResponse.success("Tokens refreshed successfully."));
});

export default {
    initiateRegistration,
    verifyRegistrationOtp,
    loginUser,
    logout,
    refreshTokens,
};
