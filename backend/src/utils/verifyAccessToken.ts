import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import type { AccessTokenPayload } from "../types/auth/auth.jwt.js";

const verifyAccessToken = (token: string) => {
    return jwt.verify(token, config.JWT.ACCESS_TOKEN_SECRET!) as AccessTokenPayload;
};

export default verifyAccessToken;
