import type { CorsOptions } from "cors";
import config from "../config/environment.js";

const corsConfig: CorsOptions = {
    origin: config.ALLOWED_ORIGIN,
    credentials: true,
};

export default corsConfig;
