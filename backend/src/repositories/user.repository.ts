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

/** Updates a user's profile image path.
 *
 * @param {string} userId - The ID of the user to update.
 * @param {string} path - The new image path.
 * @returns {Promise<any>} A promise resolving to the update result.
 */
const updateAvatarByUserId = async (userId: string, path: string) => {
    return await UserModel.updateOne({ _id: userId }, { $set: { avatar: path } }).lean();
};

/** Finds a user by their refresh token.
 *
 * @param {string} refreshToken - The refresh token to search for.
 * @returns {Promise<any>} A promise resolving to the matching user document.
 */
const findUserByRefreshToken = async (refreshToken: string) => {
    return await UserModel.findOne({ refreshToken }).select(
        "+refreshToken +expiresAt -createdAt -updatedAt -dob -gender -__v",
    );
};

/** Removes a refresh token and its expiry time from a user.
 *
 * @param {string} refreshTokenHash - The hashed refresh token to remove.
 * @returns {Promise<any>} A promise resolving to the update result.
 */
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

/** Gets a random list of users who are not the current user or their friends.
 *
 * @param {string} currentUserId - The ID of the current user.
 * @param {Types.ObjectId[] | string[]} friendIds - IDs of the current user's friends.
 * @returns {Promise<UserSuggestion[]>} A promise resolving to user suggestions.
 */
const findRandomUserSuggestions = async (
    currentUserId: string,
    friendIds: Types.ObjectId[] | string[],
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

/** Finds users by their IDs and returns selected fields.
 *
 * @param {Types.ObjectId[]} userIds - IDs of the users to find.
 * @param {string} [fields="username name avatar"] - Fields to return.
 * @returns {Promise<any[]>} A promise resolving to the matching users.
 */
const findUsersByIds = async (
    userIds: Types.ObjectId[],
    fields: string = "username name avatar",
) => {
    return UserModel.find({
        _id: {
            $in: userIds,
        },
    })
        .select(fields)
        .lean();
};

/** Updates a user's password.
 *
 * @param {string | Types.ObjectId} userId - The ID of the user to update.
 * @param {string} password - The new password value.
 * @returns {Promise<any>} A promise resolving to the update result.
 */
const updatePasswordByUserId = async (userId: string | Types.ObjectId, password: string) => {
    return UserModel.updateOne(
        {
            _id: userId,
        },
        {
            $set: {
                password,
            },
        },
    );
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
    findUsersByIds,
    updatePasswordByUserId,
};
