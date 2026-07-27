import asyncHandler from "../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";
import authService from "../services/auth.service.js";
import getCookieOptions from "../utils/getCookieOptions.js";
import { ACCESS_TOKEN_COOKIE_EXPIRY, REFRESH_TOKEN_COOKIE_EXPIRY } from "../constants/constants.js";
import ApiResponse from "../utils/apiResponse.js";
import type { LoginUserRequest, RegisterUserRequest } from "../types/auth/auth.request.js";

// Register User
const registerUser = asyncHandler(async (req: RegisterUserRequest, res) => {
    const { createdUser, tokens } = await authService.registerUser(req.body);

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
    registerUser,
    loginUser,
};
