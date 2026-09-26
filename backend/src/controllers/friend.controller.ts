import asyncHandler from "../utils/asyncHandler.js";
import friendService from "../services/friend.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";
import type {
    AddFriendRequest,
    GetFriendshipsByStatusRequest,
} from "../types/friend/friend.request.js";
import type { GetFriendsByStatus } from "../types/friend/friend.service.js";
import _ from "lodash";

// Sends a request to connect with another user.
const sendFriendRequest = asyncHandler(async (req: AddFriendRequest, res) => {
    const senderId = String(req.user?._id);
    const receiverId = req.body.receiverId;

    const friend = await friendService.sendFriendRequest(senderId, receiverId);

    return res
        .status(StatusCodes.CREATED)
        .json(ApiResponse.created("Friend request sent successfully.", friend));
});

// Finds users who may be good friends for the current user.
const getFriendSuggestions = asyncHandler(async (req, res) => {
    const userId = String(req.user?._id);

    const suggestions = await friendService.getFriendSuggestions(userId);

    return res.status(StatusCodes.OK).json(
        ApiResponse.success("Friend suggestions fetched successfully.", {
            suggestions,
        }),
    );
});

// Gets friends filtered by their connection status.
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

// Accepts a pending friend request.
const acceptFriendRequest = asyncHandler(async (req, res) => {
    const userId = String(req.user?._id);
    const friendshipId = String(req.params?.friendshipId);

    await friendService.acceptFriendRequest(userId, friendshipId);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Friend request accepted successfully."));
});

// Gets friend requests sent by the current user.
const getSentFriendshipsByStatus = asyncHandler(async (req: GetFriendshipsByStatusRequest, res) => {
    const userId = String(req.user?._id);
    const status = req.query?.status || "pending";

    const friendships = await friendService.getSentFriendshipsByStatus(userId, status);

    return res.status(StatusCodes.OK).json(
        ApiResponse.success(`${_.capitalize(status)} friends retrieved successfully.`, {
            friendships,
        }),
    );
});

// Gets friend requests received by the current user.
const getReceivedFriendRequests = asyncHandler(async (req, res) => {
    const userId = String(req.user?._id);

    const requests = await friendService.getReceivedFriendRequests(userId);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Friend requests retrieved successfully.", { requests }));
});

// Removes an existing friend connection.
const removeFriend = asyncHandler(async (req, res) => {
    const userId = String(req.user?._id);
    const friendshipId = String(req.params?.friendshipId);

    await friendService.removeFriend(userId, friendshipId);

    return res.status(StatusCodes.OK).json(ApiResponse.success("Friend removed successfully."));
});

// Rejects a pending friend request.
const rejectFriendRequest = asyncHandler(async (req, res) => {
    const userId = String(req.user?._id);
    const friendshipId = String(req.params?.friendshipId);

    await friendService.rejectFriendRequest(userId, friendshipId);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Friend request rejected successfully."));
});

// Cancels a friend request sent by the current user.
const cancelFriendRequest = asyncHandler(async (req, res) => {
    const userId = String(req.user?._id);
    const friendshipId = String(req.params?.friendshipId);

    await friendService.cancelFriendRequest(userId, friendshipId);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("Friend request canceled successfully."));
});

export default {
    sendFriendRequest,
    getFriendSuggestions,
    getFriendsByStatus,
    acceptFriendRequest,
    getSentFriendshipsByStatus,
    getReceivedFriendRequests,
    removeFriend,
    rejectFriendRequest,
    cancelFriendRequest,
};
