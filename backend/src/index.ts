import config from "./config/environment.js";
import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./utils/logger.js";
import getErrorMessage from "./utils/getErrorMessage.js";

const flushLogsAndExit = (code: 0 | 1): void => {
    logger.on("finish", () => process.exit(code));
    logger.end();
};

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception - Shutting down...", {
        meta: {
            name: error.name,
            message: error.message,
            stack: error.stack,
        },
    });

    flushLogsAndExit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Promise Rejection - Shutting down...", {
        meta: {
            reason: getErrorMessage(reason),
        },
    });

    flushLogsAndExit(1);
});

// Graceful shutdown
function gracefulShutdown(server: ReturnType<typeof app.listen>, signal: NodeJS.Signals): void {
    logger.info(`Received ${signal}, shutting down gracefully...`);

    const forceShutdown = setTimeout(() => {
        logger.error("Forced shutdown after timeout (15s)");
        process.exit(1);
    }, 15000).unref();

    server.close((error) => {
        clearTimeout(forceShutdown);

        if (error) {
            logger.error("Error during server shutdown", {
                meta: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
            });

            process.exit(1);
        }

        logger.info("Graceful shutdown completed");

        logger.on("finish", () => process.exit(0));
        logger.end();

        flushLogsAndExit(0);
    });
}

// Connect to DB and start the server
void (async () => {
    try {
        await connectDB();

        const server = app.listen(config.PORT, () => {
            logger.info("Server is running", {
                PORT: config.PORT,
                SERVER_URL: config.SERVER_URL,
                ENVIRONMENT: config.NODE_ENV,
            });
        });

        // Handle graceful shutdowns
        process.on("SIGINT", () => gracefulShutdown(server, "SIGINT"));
        process.on("SIGTERM", () => gracefulShutdown(server, "SIGTERM"));
    } catch (error) {
        logger.error("Server startup faild", {
            message: getErrorMessage(error),
        });

        process.exit(1);
    }
})();
