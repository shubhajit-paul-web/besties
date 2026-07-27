import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import type { AccessTokenPayload } from "../types/auth/auth.jwt.js";

/**
 * Authenticates requests by validating the access token and attaching the decoded user.
 */
const authenticate = (req: Request, _res: Response, next: NextFunction) => {
    const headerToken = req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined;
    const cookieToken = req.cookies?.accessToken as string | undefined;

    const accessToken = (cookieToken ?? headerToken)?.trim();

    if (!accessToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized: Access token is missing.");
    }

    try {
        const decoded = jwt.verify(
            accessToken,
            config.JWT.ACCESS_TOKEN_SECRET!,
        ) as AccessTokenPayload;

        req.user = decoded;
        next();
    } catch (err) {
        if (err instanceof jwt.JsonWebTokenError) {
            if (err.name === "TokenExpiredError") {
                return next(
                    new ApiError(
                        StatusCodes.UNAUTHORIZED,
                        "Access token has expired. Please sign in again.",
                    ),
                );
            }
            if (err.name === "JsonWebTokenError") {
                return next(new ApiError(StatusCodes.UNAUTHORIZED, "Invalid access token."));
            }
            if (err.name === "NotBeforeError") {
                return next(
                    new ApiError(StatusCodes.UNAUTHORIZED, "Access token is not yet valid."),
                );
            }
        }

        return next(new ApiError(StatusCodes.UNAUTHORIZED, "Authentication failed."));
    }
};

export default authenticate;
