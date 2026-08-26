import type { AccessTokenPayload } from "../../types/auth/auth.jwt.js";

export type PresenceUser = Pick<
    AccessTokenPayload,
    "_id" | "username" | "email" | "avatar" | "name"
>;

export type MessagePayload = {
    from: string;
    to: string;
    message: string;
};
