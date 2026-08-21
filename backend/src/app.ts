import express from "express";
import config from "./config/environment.js";
import morgan from "morgan";
import { httpLogStream } from "./utils/logger.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";
import globalErrorHandler from "./middlewares/error.middleware.js";
import ApiError from "./utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import swaggerUi from "swagger-ui-express";
import swaggerUiConfig from "./config/swagger.js";

const app = express();

app.use(morgan(config.NODE_ENV === "dev" ? "dev" : "combined", { stream: httpLogStream }));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(helmet());
app.use(compression());

// Route imports
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import friendRoutes from "./routes/friend.routes.js";
import corsConfig from "./config/cors.js";

// Route implementations
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/friends", friendRoutes);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerUiConfig.swaggerDocument, swaggerUiConfig.swaggerUiOptions),
);

// 404 Middleware
app.use((req, _res, next) =>
    next(new ApiError(StatusCodes.NOT_FOUND, `${req.originalUrl} not found`)),
);

// Global error handler
app.use(globalErrorHandler);

export default app;
