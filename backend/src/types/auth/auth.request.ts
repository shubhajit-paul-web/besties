/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from "express";
import type { VerifyRegistrationOtpInput } from "../../validators/auth.validator.js";
import type { InitiateRegistration, LoginUserInput } from "./auth.types.js";
import type { UserDocument, UserMethods } from "../../models/types/user.types.js";
import type { AccessTokenPayload } from "./auth.jwt.js";

export type InitiateRegistrationRequest = Request<{}, {}, InitiateRegistration>;

export type VerifyRegistrationOtpRequest = Request<{}, {}, VerifyRegistrationOtpInput>;

export type LoginUserRequest = Request<{}, {}, LoginUserInput>;

export type RefreshAuthType = Pick<
    AccessTokenPayload,
    "_id" | "username" | "email" | "avatar" | "name"
> &
    Required<Pick<UserDocument, "refreshToken" | "expiresAt">> &
    Pick<UserMethods, "generateAccessAndRefreshTokens">;

export type RefreshTokenRequest = Request & {
    cookies: {
        refreshToken?: string;
    };
};

export type ForgotPasswordRequest = Request<
    {},
    {},
    {
        identifier: string;
    }
>;
