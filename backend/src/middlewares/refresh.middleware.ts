import type { NextFunction, Response } from "express";
import ApiError from "../utils/apiError.js";
import { sha256 } from "../utils/crypto.js";
import userRepository from "../repositories/user.repository.js";
import { StatusCodes } from "http-status-codes";
import moment from "moment";
import type { RefreshAuthType, RefreshTokenRequest } from "../types/auth/auth.request.js";

const validateRefreshToken = async (
    req: RefreshTokenRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        // Read the refresh token from the cookie sent by the client.
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token is required.");
        }

        // Hash it before checking the database, so the stored value stays safe.
        const refreshTokenHash = sha256(refreshToken);

        const user = await userRepository.findUserByRefreshToken(refreshTokenHash);

        if (!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token.");
        }

        // Reject expired tokens before letting the request continue.
        const isExpired = moment().isAfter(user.expiresAt);

        if (isExpired) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token has expired.");
        }

        // Attach the user info needed by the next auth step.
        req.refreshAuth = user as RefreshAuthType;
        next();
    } catch (err) {
        return next(err);
    }
};

export default validateRefreshToken;
