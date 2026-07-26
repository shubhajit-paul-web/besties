import { NextFunction, Request, Response } from "express";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";

interface UserPayload {
    _id: string;
    username: string;
    email: string;
}

export interface AuthenticatedRequest extends Request {
    user?: UserPayload;
    cookies: {
        accessToken?: string;
    };
}

interface JwtPayload extends jwt.JwtPayload, UserPayload {}

const authenticate = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    const accessToken =
        req.cookies?.accessToken?.trim() ?? req.headers["authorization"]?.split(" ")[1]?.trim();

    if (!accessToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized: Access token is missing.");
    }

    try {
        const decoded = jwt.verify(accessToken, config.JWT.ACCESS_TOKEN_SECRET!) as JwtPayload;

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
