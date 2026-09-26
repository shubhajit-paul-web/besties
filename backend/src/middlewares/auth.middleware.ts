import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import verifyAccessToken from "../utils/verifyAccessToken.js";

/**
 * Authenticates requests by validating the access token and attaching the decoded user.
 */
const authenticate = (req: Request, _res: Response, next: NextFunction) => {
    // Try token from the Authorization header first, then from cookies.
    const headerToken = req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.slice(7)
        : undefined;
    const cookieToken = req.cookies?.accessToken as string | undefined;

    // Accept either place, but keep only the valid one.
    const accessToken = (cookieToken ?? headerToken)?.trim();

    if (!accessToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized: Access token is missing.");
    }

    try {
        // Verify the token and attach the decoded user for the route.
        const decoded = verifyAccessToken(accessToken);

        req.user = {
            ...decoded,
            _id: String(decoded._id),
        };
        next();
    } catch (err) {
        // Give a clear message depending on what went wrong with the token.
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
