import asyncHandler from "../utils/asyncHandler.js";
import userService from "../services/user.service.js";
import { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";

const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res) => {
    const user = await userService.getCurrentUser(req.user?._id as string);

    return res
        .status(StatusCodes.OK)
        .json(ApiResponse.success("User profile fetched successful.", { user }));
});

export default {
    getCurrentUser,
};
