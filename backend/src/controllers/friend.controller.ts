import asyncHandler from "../utils/asyncHandler.js";
import friendService from "../services/friend.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";
import type { AcceptFriendRequest, AddFriendRequest } from "../types/friend/friend.request.js";
import type { GetFriendsByStatus } from "../types/friend/friend.service.js";
import _ from "lodash";

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

const getFriendsByStatus = asyncHandler(async (req: GetFriendsByStatus, res) => {
    const userId = String(req.user?._id);
    const status = req.query?.status || "accepted";

    const friends = await friendService.getFriendsByStatus(userId, status);

    return res.status(StatusCodes.OK).json(
        ApiResponse.success(`${_.capitalize(status)} friends retrieved successfully.`, {
            friends,
        }),
    );
});

const acceptFriendRequest = asyncHandler(async (req: AcceptFriendRequest, res) => {
    const userId = String(req.user?._id);
    const friendshipId = req.params.id;

    await friendService.acceptFriendRequest(userId, friendshipId);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Friend request accepted successfully."));
});

export default { sendFriendRequest, getFriendSuggestions, getFriendsByStatus, acceptFriendRequest };
