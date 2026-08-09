import type { RegisterUserDto } from "../dto/user.dto.js";
import UserModel from "../models/user.model.js";
import { PipelineStage, QueryFilter, Types } from "mongoose";
import type { UserSuggestion } from "../types/user/user.request.js";

/**
 * Checks whether a username already exists.
 *
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} A promise resolving to whether the username exists.
 */
const existsByUsername = async (username: string) => {
    return await UserModel.exists({ username });
};

/**
 * Checks whether an email or mobile number already exists.
 *
 * @param {string} email - The email address to check.
 * @param {string | undefined} mobileNumber - The mobile number to check.
 * @returns {Promise<boolean>} A promise resolving to whether either value exists.
 */
const existsByEmailOrMobile = async (email: string, mobileNumber: string | undefined) => {
    const conditions: QueryFilter<{ email: string; mobileNumber?: string }>[] = [{ email }];

    if (mobileNumber) {
        conditions.push({ mobileNumber });
    }

    return await UserModel.exists({
        $or: conditions,
    });
};

/**
 * Creates a new user record.
 *
 * @param {RegisterUserDto} userData - The user data to store.
 * @returns {Promise<any>} A promise resolving to the created user document.
 */
const create = async (userData: RegisterUserDto) => {
    return await UserModel.create(userData);
};

/**
 * Finds a user by username or email and returns selected fields.
 *
 * @param {string} identifier - The username or email to search for.
 * @param {string} fields - A MongoDB field projection string.
 * @returns {Promise<any>} A promise resolving to the matching user document.
 */
const findUserByIdentifier = async (identifier: string, fields: string) => {
    return await UserModel.findOne({
        $or: [{ username: identifier }, { email: identifier }],
    }).select(fields);
};

/**
 * Finds a user by ID, optionally returning a lean document and selected fields.
 *
 * @param {string} userId - The user ID to look up.
 * @param {boolean} [lean=true] - Whether to return a lean document.
 * @param {string} [fields] - Optional field projection string.
 * @returns {Promise<any>} A promise resolving to the matching user document.
 */
const findUserById = async (userId: string, lean: boolean = true, fields?: string) => {
    const query = UserModel.findById(userId);

    if (lean) query.lean();
    if (fields) query.select(fields);

    return await query;
};

const updateAvatarByUserId = async (userId: string, path: string) => {
    return await UserModel.updateOne({ _id: userId }, { $set: { avatar: path } }).lean();
};

const findUserByRefreshToken = async (refreshToken: string) => {
    return await UserModel.findOne({ refreshToken }).select(
        "+refreshToken +expiresAt -createdAt -updatedAt -dob -gender -__v",
    );
};

const removeRefreshToken = async (refreshTokenHash: string) => {
    return UserModel.updateOne(
        {
            refreshToken: refreshTokenHash,
        },
        {
            $unset: { refreshToken: "", expiresAt: "" },
        },
    );
};

const findRandomUserSuggestions = async (
    currentUserId: string,
    friendIds: Types.ObjectId[],
): Promise<UserSuggestion[] | []> => {
    const pipeline: PipelineStage[] = [
        {
            $match: {
                _id: {
                    $nin: [currentUserId, ...friendIds],
                },
            },
        },
        {
            $sample: {
                size: 5,
            },
        },
        {
            $project: {
                username: 1,
                name: 1,
                avatar: 1,
            },
        },
    ];

    return UserModel.aggregate(pipeline);
};

export default {
    existsByUsername,
    existsByEmailOrMobile,
    create,
    findUserByIdentifier,
    findUserById,
    updateAvatarByUserId,
    findUserByRefreshToken,
    removeRefreshToken,
    findRandomUserSuggestions,
};
