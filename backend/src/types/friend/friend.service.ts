import type { Request } from "express";
import type { FriendDocument } from "../../models/friend.model.js";
import type { UserDocument } from "../../models/types/user.types.js";

export type UserSuggestion = Pick<UserDocument, "_id" | "username" | "avatar" | "name">;

export type GetFriendsByStatus = Request & {
    query: {
        status?: FriendDocument["status"];
    };
};
