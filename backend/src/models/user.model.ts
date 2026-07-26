import { Model, Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import getErrorMessage from "../utils/getErrorMessage.js";
import ApiError from "../utils/apiError.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";

interface User {
    username: string;
    name: {
        first: string;
        last?: string;
    };
    avatar: {
        url?: string;
        fileId?: string;
    };
    bio?: string;
    gender: "male" | "female" | "custom";
    dob: Date;
    email: string;
    mobileNumber?: string;
    password: string;
    usernameUpdatedAt?: Date;
    refreshToken?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface UserMethods {
    comparePassword(plainTextPassword: string): Promise<boolean>;
    generateAccessAndRefreshTokens(): Promise<{ accessToken: string; refreshToken: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type UserModelType = Model<User, {}, UserMethods>;

const userSchema = new Schema<User, UserModelType, UserMethods>(
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
                // required: true,
            },
        },
        avatar: {
            url: String,
            fileId: String,
        },
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
        const { __v, refreshToken: _refreshToken, password: _password, ...publicUser } = userObject;
        return publicUser;
    },
});

// Hash the password if it is being modified or created
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
            getErrorMessage(err),
        );
    }
});

// Check if the username field was changed (or is new)
userSchema.pre("save", function () {
    if (this.isModified("username") && !this.isNew) {
        this.usernameUpdatedAt = new Date();
    }
});

userSchema.methods.comparePassword = async function (plainTextPassword: string) {
    try {
        return await bcrypt.compare(plainTextPassword, this.password);
    } catch (err) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal server error",
            false,
            `BcryptError: Password verification faild for the user: ${this.email}`,
            String(err),
        );
    }
};

userSchema.methods.generateAccessAndRefreshTokens = async function () {
    const payload = {
        _id: this._id,
        username: this.username,
        email: this.email,
    };

    try {
        const accessToken = jwt.sign(payload, config.JWT.ACCESS_TOKEN_SECRET!, {
            expiresIn: config.JWT.ACCESS_TOKEN_EXPIRY,
        });
        const refreshToken = jwt.sign(payload, config.JWT.REFRESH_TOKEN_SECRET!, {
            expiresIn: config.JWT.REFRESH_TOKEN_EXPIRY,
        });

        this.refreshToken = refreshToken;
        await this.save();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            "Internal server error",
            false,
            `JWTError: Failed to generate JWT access and refresh tokens for user: ${payload.email}`,
            String(error),
        );
    }
};

const UserModel = model<User, UserModelType>("User", userSchema);
export default UserModel;
