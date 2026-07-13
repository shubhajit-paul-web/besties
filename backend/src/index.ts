import config from "./config/environment.js";
import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./utils/logger.js";
import getErrorMessage from "./utils/getErrorMessage.js";

const PORT = config.PORT;

void (async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Server startup faild", {
            message: getErrorMessage(error),
        });
    }
})();
