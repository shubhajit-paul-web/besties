import "dotenv/config";
import type { StringValue } from "ms";

/*
    Validate all required environment variables at startup so the application
    fails fast with a clear error instead of crashing later due to missing configuration.
 */
const REQUIRED_ENV_VARIABLES = [
    "PORT",
    "NODE_ENV",
    "ALLOWED_ORIGIN",
    "MONGODB_URI",
    "REDIS_URL",
    "ACCESS_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_BUCKET_NAME",
    "AWS_REGION",
    "AWS_S3_URL",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_SECURE",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "SMTP_FROM",
];

const missingEnvVariables = REQUIRED_ENV_VARIABLES.filter((key) => !process.env[key]);

if (missingEnvVariables.length) {
    throw new Error(
        `Configuration error: Missing required environment variables: ${missingEnvVariables.join(", ")}`,
    );
}

const config = {
    PORT: Number(process.env.PORT) || 8080,
    NODE_ENV: process.env.NODE_ENV || "dev",
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
    SERVER_URL: process.env.SERVER_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    REDIS_URL: process.env.REDIS_URL,
    JWT: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as StringValue,
    },
    AWS: {
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        BUCKET_NAME: process.env.AWS_BUCKET_NAME,
        REGION: process.env.AWS_REGION,
        S3_URL: process.env.AWS_S3_URL,
    },
    SMTP: {
        HOST: process.env.SMTP_HOST,
        PORT: Number(process.env.SMTP_PORT),
        SECURE: process.env.SMTP_SECURE,
        USER: process.env.SMTP_USER,
        PASSWORD: process.env.SMTP_PASSWORD,
        FROM: process.env.SMTP_FROM,
    },
};

export default Object.freeze(config);
