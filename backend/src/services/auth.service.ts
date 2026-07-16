import z from "zod";
import { registerUserSchema } from "../validators/auth.validator.js";
import userRepository from "../repositories/user.repository.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";

// Strongly typed Express request body, params, and query
// interface TypedRequest<Body = unknown, Params = unknown, Query = unknown> extends Request {
//     body: Body;
//     params: Params & Request["params"];
//     query: Query & Request["query"];
// }

const registerUser = async (userData: z.infer<typeof registerUserSchema>) => {
    const { username, email, mobileNumber } = userData;

    const isUsernameAlreadyExists = await userRepository.existsByUsername(username);

    if (isUsernameAlreadyExists) {
        throw new ApiError(StatusCodes.CONFLICT, "Username is already taken");
    }

    const isUserAlreadyExist = await userRepository.existsByEmailOrMobile(email, mobileNumber);

    if (isUserAlreadyExist) {
        throw new ApiError(
            StatusCodes.CONFLICT,
            "An account with the provided email or phone number already exists",
        );
    }

    const { name, gender, dob, password } = userData;

    const createdUser = await userRepository.create({
        username,
        name: {
            first: name.first,
            last: name.last,
        },
        gender,
        dob,
        email,
        mobileNumber,
        password,
    });

    return createdUser;
};

export default {
    registerUser,
};
