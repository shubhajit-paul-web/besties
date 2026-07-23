import asyncHandler from "../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";
import authService from "../services/auth.service.js";
import z from "zod";
import { registerUserSchema } from "../validators/auth.validator.js";
import { CookieOptions, Request } from "express";
import config from "../config/environment.js";

// Strongly typed Express request body, params, and query
interface TypedRequest<Body = unknown, Params = unknown, Query = unknown> extends Request {
    body: Body;
    params: Params & Request["params"];
    query: Query & Request["query"];
}

const registerUser = asyncHandler(
    async (req: TypedRequest<z.infer<typeof registerUserSchema>>, res) => {
        const user = await authService.registerUser(req.body);

        const { accessToken, refreshToken } = await authService.generateAccessAndRefreshToken({
            _id: String(user._id),
            username: user.username,
            email: user.email,
        });

        const cookieOptions: CookieOptions = {
            httpOnly: true,
            secure: config.NODE_ENV === "prod",
            sameSite: "strict",
        };

        res.cookie("accessToken", accessToken, {
            ...cookieOptions,
            maxAge: 10 * 60 * 1000, // 10 minutes
        });

        res.cookie("refreshToken", refreshToken, {
            ...cookieOptions,
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
        });

        res.status(StatusCodes.CREATED).json(ApiResponse.success("Signup successful", { user }));
    },
);

export default {
    registerUser,
};
