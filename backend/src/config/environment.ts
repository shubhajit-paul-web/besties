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
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRY",
    "REFRESH_TOKEN_EXPIRY",
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
    JWT: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
        ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY as StringValue,
        REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY as StringValue,
    },
};

export default Object.freeze(config);
