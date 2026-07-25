import asyncHandler from "../utils/asyncHandler.js";
import z from "zod";
import { StatusCodes } from "http-status-codes";
import authService from "../services/auth.service.js";
import { Request } from "express";
import { registerUserSchema } from "../validators/auth.validator.js";
import getCookieOptions from "../utils/getCookieOptions.js";
import { ACCESS_TOKEN_COOKIE_EXPIRY, REFRESH_TOKEN_COOKIE_EXPIRY } from "../constants/constants.js";
import ApiResponse from "../utils/apiResponse.js";

// Strongly typed Express request body, params, and query
interface TypedRequest<Body = unknown, Params = unknown, Query = unknown> extends Request {
    body: Body;
    params: Params & Request["params"];
    query: Query & Request["query"];
}

type RegisterUser = TypedRequest<z.infer<typeof registerUserSchema>>;

interface LoginUser extends Request {
    body: {
        identifier: string;
        password: string;
    };
}

// Register User
const registerUser = asyncHandler(async (req: RegisterUser, res) => {
    const { createdUser, tokens } = await authService.registerUser(req.body);

    res.cookie("accessToken", tokens.accessToken, getCookieOptions(ACCESS_TOKEN_COOKIE_EXPIRY));
    res.cookie("refreshToken", tokens.refreshToken, getCookieOptions(REFRESH_TOKEN_COOKIE_EXPIRY));

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.success("Account created successfully", { user: createdUser }));
});

// Login user
const loginUser = asyncHandler(async (req: LoginUser, res) => {
    const { user, tokens } = await authService.loginUser(req.body, req.ip);

    res.cookie("accessToken", tokens.accessToken, getCookieOptions(ACCESS_TOKEN_COOKIE_EXPIRY));
    res.cookie("refreshToken", tokens.refreshToken, getCookieOptions(REFRESH_TOKEN_COOKIE_EXPIRY));

    return res.status(StatusCodes.OK).json(ApiResponse.success("Login successful", { user }));
});

export default {
    registerUser,
    loginUser,
};
