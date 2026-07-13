import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";

interface ErrorRequestInterface {
    statusCode: number;
    message: string;
    isOperational: boolean;
    details?: object | string;
    stack?: string;
}

function globalErrorHandler(
    err: ErrorRequestInterface,
    req: Request,
    res: Response,
    _next: NextFunction,
) {
    const statusCode = err?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    const isOperational = Boolean(err?.isOperational);

    if (statusCode >= 500) logger.error(err);

    res.status(statusCode).json({
        success: false,
        statusCode,
        isOperational,
        message: err?.statusCode ? err?.message : "Internal server error",
    });
}

export default globalErrorHandler;
