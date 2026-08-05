import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.js";
import { sha256 } from "../utils/crypto.js";
import userRepository from "../repositories/user.repository.js";
import { StatusCodes } from "http-status-codes";
import moment from "moment";
import type { RefreshAuthType } from "../types/auth/auth.request.js";

type ValidateRefreshTokenRequest = Request & {
    cookies: {
        refreshToken?: string;
    };
};

const validateRefreshToken = async (
    req: ValidateRefreshTokenRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is required.");
        }

        const refreshTokenHash = sha256(refreshToken);

        const user = await userRepository.findUserByRefreshToken(refreshTokenHash);

        if (!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token.");
        }

        const isExpired = moment().isAfter(user.expiresAt);

        if (isExpired) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token has expired.");
        }

        req.refreshAuth = user as RefreshAuthType;
        next();
    } catch (err) {
        return next(err);
    }
};

export default validateRefreshToken;
