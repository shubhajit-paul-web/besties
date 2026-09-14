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

            if (data.body) {
                req.body = data.body;
            }

            if (data.params) {
                req.params = data.params as Record<string, string>;
            }

            if (data.query) {
                req.query = data.query as unknown as typeof req.query;
            }

            next();
        } catch (err) {
            if (err instanceof ZodError) {
                const errors = err.issues.map(({ path, message, code }) => {
                    const source = path[0] ?? "unknown";
                    const field = path.slice(1).join(".");
                    const isMissingSection = path.length <= 1 && code === "invalid_type";

                    return {
                        source,
                        field,
                        message: isMissingSection
                            ? `Request ${String(source)} is required`
                            : message,
                    };
                });

                return res.status(StatusCodes.BAD_REQUEST).json({
                    success: false,
                    statusCode: StatusCodes.BAD_REQUEST,
                    message: "Validation failed.",
                    isOperational: true,
                    errors,
                });
            }

            next(err);
        }
    };

export default validate;
