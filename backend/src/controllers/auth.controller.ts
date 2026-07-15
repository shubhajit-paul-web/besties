import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import z from "zod";
import { signupSchema } from "../validators/auth.validator.js";
import { Request } from "express";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";

// Strongly typed Express request body, params, and query
interface TypedRequest<Body = unknown, Params = unknown, Query = unknown> extends Request {
    body: Body;
    params: Params & Request["params"];
    query: Query & Request["query"];
}

export const signup = asyncHandler(async (req: TypedRequest<z.infer<typeof signupSchema>>, res) => {
    const { username, email, mobileNumber } = req.body;

    const isUsernameAlreadyExists = await User.exists({ username });

    if (isUsernameAlreadyExists) {
        throw new ApiError(StatusCodes.CONFLICT, "Username is already taken");
    }

    const isUserAlreadyExist = await User.exists({
        $or: [{ email }, { mobileNumber }],
    });

    if (isUserAlreadyExist) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "An account with the provided email or phone number already exists",
        );
    }

    const { name, gender, dob, password } = req.body;

    const createdUser = await User.create({
        username,
        name: {
            first: name.first,
            last: name.last,
        },
        gender,
        dob,
        password,
    });

    res.status(StatusCodes.CREATED).json(
        ApiResponse.success("Signup successful", { user: createdUser }),
    );
});
