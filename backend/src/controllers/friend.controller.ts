import asyncHandler from "../utils/asyncHandler.js";
import friendService from "../services/friend.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";
import type { AddFriendRequest } from "../types/friend/friend.request.js";

const addFriend = asyncHandler(async (req: AddFriendRequest, res) => {
    const senderId = String(req.user?._id);
    const receiverId = req.body.receiverId;

    const friend = await friendService.addFriend(senderId, receiverId);

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.created("Friend request sent successfully.", friend));
});

export default { addFriend };
