import crypto from "crypto";

export const generateRandomToken = (size = 64) => {
    return crypto.randomBytes(size).toString("hex");
};

export const shah256 = (value: string) => {
    return crypto.createHash("shah256").update(value).digest("hex");
};
