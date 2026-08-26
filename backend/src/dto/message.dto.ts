import type { MessageDocument } from "../models/message.model.js";

export type CreateMessageDto = Omit<MessageDocument, "createdAt" | "_id">;
