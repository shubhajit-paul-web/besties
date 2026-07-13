import logger from "./logger.js";

const stream = {
    write(message: string) {
        logger.http(message.trim());
    },
};

export default stream;
