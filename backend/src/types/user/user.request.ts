/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Request } from "express";
import type { SupportedFileType } from "../storage/storage.service.js";
import type { UserDocument } from "../../models/types/user.types.js";

export type GenerateAvatarUploadUrlRequest = Request<{}, {}, { type: SupportedFileType }>;

export type UpdateAvatarRequest = Request<{}, {}, { path: string }>;

export type UserSuggestion = Pick<UserDocument, "_id" | "username" | "avatar" | "name">;
