import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";

const validate = (schema: ZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof ZodError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                statusCode: StatusCodes.BAD_REQUEST,
                message: "Validation failed",
                errors: err.issues,
            });
        }

        next(err);
    }
};

export default validate;
