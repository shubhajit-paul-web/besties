/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { Request } from "express";
import type { FriendDocument } from "../../models/friend.model.js";

export type AddFriendRequest = Request<{}, {}, { receiverId: string }>;

export type GetFriendshipsByStatusRequest = Request<
    {},
    {},
    {},
    { status?: FriendDocument["status"] }
>;
