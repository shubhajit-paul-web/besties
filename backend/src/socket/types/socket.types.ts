import type { AccessTokenPayload } from "../../types/auth/auth.jwt.js";
import type { MessageDocument } from "../../models/message.model.js";

export type PresenceUser = Pick<
    AccessTokenPayload,
    "_id" | "username" | "email" | "avatar" | "name"
>;

export type MessagePayload = {
    receiver: string;
    content: string;
    file?: MessageDocument["file"];
};

export type MessageAck<T = unknown> = (response: {
    success: boolean;
    message?: string;
    data?: T;
}) => void;

export type OfferPayload = {
    to: string;
    offer: RTCSessionDescriptionInit;
};

export type AnswerPayload = {
    to: string;
    answer: RTCSessionDescriptionInit;
};

export type ICECandidatePayload = {
    to: string;
    candidate: RTCIceCandidateInit;
};
