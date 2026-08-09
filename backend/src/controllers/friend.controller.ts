import asyncHandler from "../utils/asyncHandler.js";
import friendService from "../services/friend.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";
import type { AddFriendRequest } from "../types/friend/friend.request.js";

const sendFriendRequest = asyncHandler(async (req: AddFriendRequest, res) => {
    const senderId = String(req.user?._id);
    const receiverId = req.body.receiverId;

    const friend = await friendService.sendFriendRequest(senderId, receiverId);

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.created("Friend request sent successfully.", friend));
});

const getFriendSuggestions = asyncHandler(async (req, res) => {
    const userId = String(req.user?._id);

    const suggestions = await friendService.getFriendSuggestions(userId);

    return res.status(StatusCodes.OK).json(
        ApiResponse.success("Friend suggestions fetched successfully.", {
            suggestions,
        }),
    );
});

export default { sendFriendRequest, getFriendSuggestions };
