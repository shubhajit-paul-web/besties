import express from "express";
import config from "./config/environment.js";
import morgan from "morgan";
import { httpLogStream } from "./utils/logger.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import globalErrorHandler from "./middlewares/error.middleware.js";
import ApiError from "./utils/apiError.js";
import { StatusCodes } from "http-status-codes";

const app = express();

app.use(morgan(config.NODE_ENV === "dev" ? "dev" : "combined", { stream: httpLogStream }));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: config.ALLOWED_ORIGIN,
    }),
);
app.use(compression());

// Routes imports
import authRoutes from "./routes/auth.routes.js";

// Routes implementation
app.use("/auth", authRoutes);

// 404 Middleware
app.use((req, res, next) =>
    next(new ApiError(StatusCodes.NOT_FOUND, `${req.originalUrl} not found`)),
);

// Global error handler
app.use(globalErrorHandler);

export default app;
