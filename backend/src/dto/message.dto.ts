import type { Stringify } from "../types/utils.types.js";
import type { MessageDocument } from "../models/message.model.js";

export type CreateMessageDto = Stringify<Omit<MessageDocument, "createdAt" | "_id">>;
