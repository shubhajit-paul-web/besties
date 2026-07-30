import { Redis } from "ioredis";
import config from "./environment.js";
import logger from "../utils/logger.js";

const redis = new Redis(config.REDIS_URL!, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: true,

    retryStrategy(times) {
        return Math.min(times * 100, 2000); // 100ms to 2000ms
    },
});

redis.on("connect", () => {
    logger.info("Connected to Redis server");
});

redis.on("ready", () => {
    logger.info("Redis client is ready to accept commands");
});

redis.on("reconnecting", (delay: number) => {
    logger.warn(`Redis reconnecting`, {
        reconnectInMs: delay,
    });
});

redis.on("error", (err) => {
    logger.error("Redis client error", {
        message: err.message,
        stack: err.stack,
    });
});

redis.on("end", () => {
    logger.warn("Redis connection closed unexpectedly");
});

export default redis;
