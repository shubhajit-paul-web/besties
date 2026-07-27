import asyncHandler from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";
import { Request } from "express";

const getCurrentUser = asyncHandler(async (req: Request, res) => {
    const user = await userService.getCurrentUser(req.user?._id as string);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("User profile fetched successfully.", { user }));
});

export default {
    getCurrentUser,
};
