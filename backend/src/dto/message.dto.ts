import type { MessageDocument } from "../models/message.model.js";

export type CreateMessageDto = Omit<MessageDocument, "createdAt" | "sender" | "receiver"> & {
    sender: string;
    receiver: string;
};
