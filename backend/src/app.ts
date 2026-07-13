import express from "express";
import config from "./config/environment.js";
import morgan from "morgan";
import cors from "cors";
import stream from "./utils/stream.js";
import compression from "compression";
import globalErrorHandler from "./middlewares/globalErrorHandler.middleware.js";
import ApiError from "./utils/apiError.js";
import { StatusCodes } from "http-status-codes";

const app = express();

if (config.NODE_ENV !== "production") {
    app.use(morgan("dev", { stream }));
}
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(
    cors({
        origin: config.ALLOWED_ORIGIN,
    }),
);
app.use(compression());

// 404 Middleware
app.use((req, res, next) =>
    next(new ApiError(StatusCodes.NOT_FOUND, `${req.originalUrl} not found`)),
);

// Global error handler
app.use(globalErrorHandler);

export default app;
