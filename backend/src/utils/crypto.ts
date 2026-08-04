import crypto from "crypto";

export const generateRandomToken = (size = 64) => {
    return crypto.randomBytes(size).toString("hex");
};

export const sha256 = (value: string) => {
    return crypto.createHash("sha256").update(value).digest("hex");
};
