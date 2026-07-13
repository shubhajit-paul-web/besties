import mongoose from "mongoose";
import config from "./environment.js";
import logger from "../utils/logger.js";

async function connectDB() {
    try {
        await mongoose.connect(`${config.MONGODB_URI}/besties`);
        logger.info("MongoDB connected successfully");
    } catch (error) {
        logger.error("MongoDB connection failed", error);
        process.exit(1);
    }
}

export default connectDB;
