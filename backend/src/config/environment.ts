import "dotenv/config";

const config = {
    PORT: Number(process.env.PORT) || 8080,
    NODE_ENV: process.env.NODE_ENV || "dev",
    ALLOWED_ORIGIN: process.env.ALLOWED_ORIGIN,
    SERVER_URL: process.env.SERVER_URL,
    MONGODB_URI: process.env.MONGODB_URI,
};

export default Object.freeze(config);
