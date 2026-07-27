/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from "express";
import type { RegisterUserInput } from "../../validators/auth.validator.js";
import type { LoginUserInput } from "./auth.types.js";

export type RegisterUserRequest = Request<{}, {}, RegisterUserInput>;

export type LoginUserRequest = Request<{}, {}, LoginUserInput>;
