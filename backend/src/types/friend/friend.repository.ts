import { FriendDocument } from "../../models/friend.model.js";

export type FindFriendshipsByStatus = {
    currentUserId: string;
    status?: FriendDocument["status"];
    fields?: string;
};
