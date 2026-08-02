/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Model } from "mongoose";

export type UserDocument = {
    username: string;
    name: {
        first: string;
        last?: string;
    };
    avatar?: string;
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
};

export type UserMethods = {
    comparePassword(plainTextPassword: string): Promise<boolean>;
    generateAccessAndRefreshTokens(): Promise<{ accessToken: string; refreshToken: string }>;
};

export type UserModelType = Model<UserDocument, {}, UserMethods>;
