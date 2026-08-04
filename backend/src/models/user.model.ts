/* eslint-disable @typescript-eslint/no-unused-vars */
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import type { UserDocument, UserMethods, UserModelType } from "./types/user.types.js";
import { generateRandomToken, shah256 } from "../utils/crypto.js";
import moment from "moment";

const userSchema = new Schema<UserDocument, UserModelType, UserMethods>(
    {
        username: {
            type: String,
            index: true,
            unique: true,
            lowercase: true,
            trim: true,
            required: true,
            minLength: 3,
            maxLength: 30,
            match: /^[a-zA-Z0-9_]+$/,
        },
        name: {
            first: {
                type: String,
                trim: true,
                lowercase: true,
                required: true,
            },
            last: {
                type: String,
                trim: true,
                lowercase: true,
            },
        },
        avatar: String,
        bio: {
            type: String,
            trim: true,
            maxLength: 100,
        },
        gender: {
            type: String,
            enum: ["male", "female", "custom"],
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            index: true,
            unique: true,
            trim: true,
            lowercase: true,
            required: true,
        },
        mobileNumber: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            select: false,
            required: true,
        },
        usernameUpdatedAt: {
            type: Date,
            select: false,
        },
        refreshToken: {
            type: String,
            select: false,
        },
        expiresAt: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true },
);

userSchema.index(
    { mobileNumber: 1 },
    {
        unique: true,
        partialFilterExpression: {
            mobileNumber: { $type: "string" },
        },
    },
);

userSchema.set("toJSON", {
    transform: (_userDocument, userObject) => {
        const { __v, refreshToken, password, expiresAt, ...publicUser } = userObject;
        return publicUser;
    },
});

// Hash a changed password before saving the user document.
userSchema.pre("save", async function () {
    try {
        if (this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(String(this.password), 12);
            this.password = hashedPassword;
        }
    } catch (err) {
        logger.error("Failed to hash user password", {
            message: getErrorMessage(err),
        });

        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Failed to hash user password",
            false,
            {
                details: getErrorMessage(err),
            },
        );
    }
});

// Record when an existing username changes.
userSchema.pre("save", function () {
    if (this.isModified("username") && !this.isNew) {
        this.usernameUpdatedAt = new Date();
    }
});

// Compare a plain-text password against the stored hash.
userSchema.methods.comparePassword = async function (plainTextPassword: string) {
    try {
        return await bcrypt.compare(plainTextPassword, this.password);
    } catch (err) {
        logger.warn(`BcryptError: Password verification faild for the user: ${this.email}`);

        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error", false, {
            details: getErrorMessage(err),
        });
    }
};

// Issue a new access token and refresh token pair for the user.
userSchema.methods.generateAccessAndRefreshTokens = async function () {
    const payload = {
        _id: this._id,
        username: this.username,
        email: this.email,
        avatar: this.avatar ?? null,
        name: {
            first: this.name.first,
            last: this.name.last ?? null,
        },
    };

    try {
        const accessToken = jwt.sign(payload, config.JWT.ACCESS_TOKEN_SECRET!, {
            expiresIn: config.JWT.ACCESS_TOKEN_EXPIRY,
        });
        const refreshToken = generateRandomToken(64);

        this.refreshToken = shah256(refreshToken);
        this.expiresAt = moment().add(1, "year").toDate(); // after 1 year from creation

        await this.save();

        return { accessToken, refreshToken };
    } catch (err) {
        logger.warn(
            `JWTError: Failed to generate JWT access and refresh tokens for user: ${payload.email}`,
        );

        throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Internal server error", false, {
            details: getErrorMessage(err),
        });
    }
};

const UserModel = model<UserDocument, UserModelType>("User", userSchema);
export default UserModel;
