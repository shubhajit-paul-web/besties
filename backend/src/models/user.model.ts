import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import getErrorMessage from "../utils/getErrorMessage.js";

const userSchema = new Schema(
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
                required: true,
            },
        },
        profile: {
            avatar: {
                url: String,
                fileId: String,
            },
            bio: {
                type: String,
                trim: true,
                maxLength: 100,
            },
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
            unique: true,
        },
        password: {
            type: String,
            select: false,
            required: true,
        },
        usernameUpdatedAt: {
            type: Date,
            default: Date.now,
        },
        refreshToken: String,
    },
    { timestamps: true },
);

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
    }
});

// Check if the username field was changed (or is new)
userSchema.pre("save", function () {
    if (this.isModified("username") && !this.isNew) {
        this.usernameUpdatedAt = new Date();
    }
});

const User = model("User", userSchema);
export default User;
