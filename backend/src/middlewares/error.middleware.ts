import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger.js";

type ErrorRequest = {
    statusCode: number;
    message: string;
    isOperational: boolean;
    options?: {
        details?: object | string;
        stack?: string;
        meta?: object;
    };
};

type ErrorPayload = {
    success: boolean;
    statusCode: number;
    isOperational: boolean;
    message: string;
    meta?: object;
};

function globalErrorHandler(err: ErrorRequest, req: Request, res: Response, _next: NextFunction) {
    const statusCode = err?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR;
    const isOperational = Boolean(err?.isOperational);

    if (statusCode >= 500) logger.error(err);

    const payload: ErrorPayload = {
        success: false,
        statusCode,
        isOperational,
        message: err?.statusCode ? err?.message : "Internal server error.",
    };

    if (err.options?.meta) payload.meta = err.options?.meta;

    res.status(statusCode).json(payload);
}

export default globalErrorHandler;
