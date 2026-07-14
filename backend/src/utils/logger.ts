import fs from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import config from "../config/environment.js";

import winston from "winston";

const logDirectory = fileURLToPath(new URL("../../logs", import.meta.url));
const logFile = (fileName: string) => join(logDirectory, fileName);

if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const { combine, colorize, errors, printf, splat, timestamp, json } = winston.format;

const exactLevel = (level: string) =>
    winston.format((info) => (info.level === level ? info : false))();

const fileFormat = combine(timestamp(), errors({ stack: true }), json());

const consoleFormat = combine(
    colorize({ all: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }),
    splat(),
    printf(({ timestamp, level, message, stack, ...metadata }) => {
        const time = String(timestamp);
        const logLevel = String(level);
        const logMessage = String(message);
        const logStack =
            stack instanceof Error
                ? (stack.stack ?? stack.message)
                : typeof stack === "string"
                  ? stack
                  : "";
        const context = Object.keys(metadata).length > 0 ? ` ${JSON.stringify(metadata)}` : "";

        return logStack
            ? `[${time}] ${logLevel}: ${logMessage} ${logStack}${context}`
            : `[${time}] ${logLevel}: ${logMessage}${context}`;
    }),
);

const logger = winston.createLogger({
    level: config.NODE_ENV === "prod" ? "info" : "debug",
    format: combine(errors({ stack: true }), timestamp(), splat()),
    transports: [
        new winston.transports.File({
            filename: logFile("errors.log"),
            level: "error",
            format: combine(exactLevel("error"), fileFormat),
            handleExceptions: true,
            handleRejections: true,
        }),
        new winston.transports.File({
            filename: logFile("warn.log"),
            level: "warn",
            format: combine(exactLevel("warn"), fileFormat),
        }),
        new winston.transports.File({
            filename: logFile("info.log"),
            level: "info",
            format: combine(exactLevel("info"), fileFormat),
        }),
        new winston.transports.File({
            filename: logFile("http.log"),
            level: "http",
            format: combine(exactLevel("http"), fileFormat),
        }),
        new winston.transports.File({
            filename: logFile("debug.log"),
            level: "debug",
            format: combine(exactLevel("debug"), fileFormat),
        }),
        new winston.transports.File({
            filename: logFile("combined.log"),
            format: fileFormat,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: logFile("exceptions.log"),
            format: fileFormat,
        }),
    ],
    rejectionHandlers: [
        new winston.transports.File({
            filename: logFile("rejections.log"),
            format: fileFormat,
        }),
    ],
    exitOnError: false,
});

if (config.NODE_ENV !== "prod") {
    logger.add(
        new winston.transports.Console({
            format: consoleFormat,
        }),
    );
}

// HTTP log stream for morgan
export const httpLogStream = {
    write(message: string) {
        logger.http(message.trim());
    },
};

export default logger;
