import { ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { RequestValidationSchema } from "../types/utils.types.js";

const validate =
    (schema: RequestValidationSchema) => (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = schema.parse({
                body: req.body as unknown,
                params: req.params as unknown,
                query: req.query as unknown,
            });

            if (data.body !== undefined) {
                Object.assign(req.body, data.body);
            }

            if (data.params !== undefined) {
                Object.assign(req.params, data.params);
            }

            if (data.query !== undefined) {
                Object.assign(req.query, data.query);
            }

            next();
        } catch (err) {
            if (err instanceof ZodError) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Validation failed",
                    errors: err.issues.map(({ path, message }) => ({
                        source: path[0],
                        field: path.slice(1).join("."),
                        message: path.slice(1).length ? message : "Request body is required",
                    })),
                });
            }

            next(err);
        }
    };

export default validate;
