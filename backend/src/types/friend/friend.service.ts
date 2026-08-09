import type { UserDocument } from "../../models/types/user.types.js";

export type UserSuggestion = Pick<UserDocument, "_id" | "username" | "avatar" | "name">;
