import type { AccessTokenPayload } from "../../types/auth/auth.jwt.js";

export type PresenceUser = Pick<
    AccessTokenPayload,
    "_id" | "username" | "email" | "avatar" | "name"
>;

export type MessagePayload = {
    receiver: string;
    content: string;
};

export type MessageAck = (response: { success: boolean; message?: string }) => void;
