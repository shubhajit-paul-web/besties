import asyncHandler from "../utils/asyncHandler.js";
import { StatusCodes } from "http-status-codes";
import ApiResponse from "../utils/apiResponse.js";
import authService from "../services/auth.service.js";
import z from "zod";
import { registerUserSchema } from "../validators/auth.validator.js";
import { Request } from "express";

// Strongly typed Express request body, params, and query
interface TypedRequest<Body = unknown, Params = unknown, Query = unknown> extends Request {
    body: Body;
    params: Params & Request["params"];
    query: Query & Request["query"];
}

const registerUser = asyncHandler(
    async (req: TypedRequest<z.infer<typeof registerUserSchema>>, res) => {
        const user = await authService.registerUser(req.body);

        res.status(StatusCodes.CREATED).json(ApiResponse.success("Signup successful", { user }));
    },
);

export default {
    registerUser,
};
