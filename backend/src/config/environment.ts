import "dotenv/config";

const config = {
    PORT: Number(process.env.PORT) || 8080,
    NODE_ENV: process.env.NODE_ENV || "dev",
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
    SERVER_URL: process.env.SERVER_URL,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT: {
        ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
        REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    },
};

export default Object.freeze(config);
