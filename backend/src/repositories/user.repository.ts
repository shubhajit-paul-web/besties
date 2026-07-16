import User from "../models/user.model.js";
import z from "zod";
import { registerUserSchema } from "../validators/auth.validator.js";

const existsByUsername = async (username: string) => {
    return await User.exists({ username });
};

const existsByEmailOrMobile = async (email: string, mobileNumber: string) => {
    return User.exists({
        $or: [{ email }, { mobileNumber }],
    });
};

const create = async (userData: z.infer<typeof registerUserSchema>) => {
    return User.create(userData);
};

export default {
    existsByUsername,
    existsByEmailOrMobile,
    create,
};
