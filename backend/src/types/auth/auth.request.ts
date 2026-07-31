/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from "express";
import type { VerifyRegistrationOtpInput } from "../../validators/auth.validator.js";
import type { InitiateRegistration, LoginUserInput } from "./auth.types.js";

export type InitiateRegistrationRequest = Request<{}, {}, InitiateRegistration>;

export type VerifyRegistrationOtpRequest = Request<{}, {}, VerifyRegistrationOtpInput>;

export type LoginUserRequest = Request<{}, {}, LoginUserInput>;
