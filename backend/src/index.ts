import redis from "./config/redis.js";
import config from "./config/environment.js";
import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./utils/logger.js";
import getErrorMessage from "./utils/getErrorMessage.js";
import mongoose from "mongoose";
import transporter from "./config/email.js";

export let shuttingDown = false;

const flushLogsAndExit = (code: 0 | 1) => {
    logger.once("finish", () => process.exit(code));
    logger.end();
};

// Exit immediately on uncaught exceptions.
process.on("uncaughtException", (error) => {
    if (!shuttingDown) {
        logger.error("Uncaught Exception - Shutting down...", {
            name: error.name,
            message: error.message,
            stack: error.stack,
        });
    }

    flushLogsAndExit(1);
});

// Exit immediately on unhandled promise rejections.
process.on("unhandledRejection", (reason) => {
    if (!shuttingDown) {
        logger.error("Unhandled Promise Rejection - Shutting down...", {
            reason: getErrorMessage(reason),
        });
    }

    flushLogsAndExit(1);
});

// Close resources cleanly before forcing exit.
const gracefulShutdown = (server: ReturnType<typeof app.listen>, signal: NodeJS.Signals): void => {
    if (shuttingDown) return;

    shuttingDown = true;

    logger.info(`Received ${signal}, shutting down gracefully...`);

    // Prevent the process from hanging forever during shutdown.
    const forceShutdown = setTimeout(() => {
        logger.error("Forced shutdown after timeout (15s)");
        process.exit(1);
    }, 15000).unref();

    server.close((error) => {
        void (async () => {
            clearTimeout(forceShutdown);

            try {
                await mongoose.disconnect();
                logger.info("MongoDB disconnected");
            } catch (error) {
                logger.error("Faild to gracefully close MongoDB connection", { error });
            }

            try {
                redis.removeAllListeners("end");
                await redis.quit();
                logger.info("Redis disconnected");
            } catch (error) {
                logger.error("Failed to gracefully close Redis connection", { error });
            }

            if (error) {
                logger.error("Error during server shutdown", {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                });

                process.exit(1);
            }

            logger.info("Graceful shutdown completed");
            flushLogsAndExit(0);
        })();
    });
};

// Start the server only after the database connection is ready.
void (async () => {
    try {
        await connectDB();
        await transporter.verify();

        logger.info("SMTP server connected");

        const server = app.listen(config.PORT, () => {
            logger.info("Server is running", {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL,
                ENVIRONMENT: config.NODE_ENV,
            });
        });

        process.on("SIGINT", () => gracefulShutdown(server, "SIGINT"));
        process.on("SIGTERM", () => gracefulShutdown(server, "SIGTERM"));
    } catch (error) {
        logger.error("Server startup faild", {
            message: getErrorMessage(error),
        });

        process.exit(1);
    }
})();
