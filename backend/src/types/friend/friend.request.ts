/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from "express";

export type AddFriendRequest = Request<{}, {}, { receiverId: string }>;

export type AcceptFriendRequest = Request<{ id: string }>;
