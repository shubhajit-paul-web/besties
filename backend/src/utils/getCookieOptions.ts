import { CookieOptions } from "express";
import config from "../config/environment.js";

const getCookieOptions = (maxAge: number): CookieOptions => {
    return {
        httpOnly: true,
        secure: config.NODE_ENV === "prod",
        sameSite: "strict",
        maxAge,
    };
};

export default getCookieOptions;
